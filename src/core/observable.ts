import * as core from '../core'
import { ObjectKeyWeakMap } from '../utils'

export type Property = {
  set: (target?: object, key?: PropertyKey, value?: any,
        description?: core.Descriptor, root?: object) => { didChange: boolean, result: boolean }
  get: (target?: object, key?: PropertyKey, description?: core.Descriptor,
        root?: object, proxy?: object) => any
}

// Map of all of the observables in the app. Uses both the object and it's key
// to designate a particular observable. Is held in memory as a weak map so it
// can be garbage collected.
const observablesReactions = new ObjectKeyWeakMap<any, Map<symbol, {
  reactionId: symbol
  roundAdded: number
}>>()

const observablesDerivations = new ObjectKeyWeakMap<any, Map<symbol, {
  derivation: core.Derivation
  roundSet: number
}>>()

const OBSERVABLE_DESIGNATOR = Symbol('OBSERVABLE_DESIGNATOR')

/**
 * Test an object to see if it's an observable
 * @param object The object in question
 */
export function isObservable(object) {
  return object[OBSERVABLE_DESIGNATOR]
}

/**
 * Returns whether or not this key is the special OBSERVABLE_DESIGNATOR key
 * @param key The key that you are testing
 */
export function isObservableDesignatorKey(key) {
  return key === OBSERVABLE_DESIGNATOR
}

/**
 * Sets a property on an object
 * @param target The target you are setting the property on
 * @param key The key of the property you are setting
 * @param value The value you are setting
 * @param description A description of this property key
 * @param root The root of the state tree
 */
export function setProperty(
  target, key, value, description: core.Descriptor, root
) {
  if (core.isDerivationInProgress()) {
    throw new Error('You cannot mutate stuff inside of a computed property')
  }

  const setMap = {
    [core.descriptionTypes.action]: core.actionProperty.set,
    [core.descriptionTypes.arrayOf]: core.arrayOfProperty.set,
    [core.descriptionTypes.boolean]: core.booleanProperty.set,
    [core.descriptionTypes.complex]: core.complexProperty.set,
    [core.descriptionTypes.computed]: core.computedProperty.set,
    [core.descriptionTypes.mapOf]: core.mapOfProperty.set,
    [core.descriptionTypes.number]: core.numberProperty.set,
    [core.descriptionTypes.object]: core.objectProperty.set,
    [core.descriptionTypes.oneOf]: core.oneOfProperty.set,
    [core.descriptionTypes.string]: core.stringProperty.set,
  }
  const set = setMap[description.type]
  if (set == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }
  const setResult = set(target, key, value, description, root)

  if (setResult.didChange) {
    markObservablesDerivationsAsStale(target, key)
    core.addObservablesReactionsToPendingReactions(target, key)
  }

  return setResult.result
}

/**
 * Mark this derivation and all of it's parent derivations as stale and setup the reactions to
 * trigger
 */
export function markObservablesDerivationsAsStale(target, key) {
  getDerivationsOfObservable(target, key).forEach(({ derivation, roundSet }) => {
    if (derivation.round !== roundSet) {
      removeDerivationFromObservable(target, key, derivation.id)
    } else if (derivation.stale === false) {
      derivation.stale = true
      // Include some way to throw away observables that are not part of it's calculation anymore
      core.addObservablesReactionsToPendingReactions(derivation.object, derivation.key)
      markObservablesDerivationsAsStale(derivation.object, derivation.key)
    }
  })
}

/**
 * Get property
 */
export function getProperty(target, key, description: core.Descriptor, root, proxy) {
  const getMap = {
    [core.descriptionTypes.action]: core.actionProperty.get,
    [core.descriptionTypes.arrayOf]: core.arrayOfProperty.get,
    [core.descriptionTypes.boolean]: core.booleanProperty.get,
    [core.descriptionTypes.complex]: core.complexProperty.get,
    [core.descriptionTypes.computed]: core.computedProperty.get,
    [core.descriptionTypes.mapOf]: core.mapOfProperty.get,
    [core.descriptionTypes.number]: core.numberProperty.get,
    [core.descriptionTypes.object]: core.objectProperty.get,
    [core.descriptionTypes.oneOf]: core.oneOfProperty.get,
    [core.descriptionTypes.string]: core.stringProperty.get,
  }

  // If there is no description then this key doesn't exist on the
  // description - try to return it anyhow.
  if (description == undefined) {
    return Reflect.get(target, key)
  }

  const get = getMap[description.type]

  if (get == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }

  if (core.isReactionInProgress() && description.type !== core.descriptionTypes.action) {
    const reaction = core.getActiveReaction()
    addReactionToObservable(target, key, reaction.id, reaction.round)
  }

  if (core.isDerivationInProgress() && description.type !== core.descriptionTypes.action) {
    const derivation = core.getActiveDerivation()
    addDerivationToObservable(target, key, derivation)
  }

  return get(target, key, description, root, proxy)
}

/**
 * Registers a reaction with an observable so when the observable is mutated it
 * can know to trigger this reaction.
 */
function addReactionToObservable(
  object: any, key: PropertyKey, reactionId: symbol, roundAdded: number
) {
  if (observablesReactions.has(object, key)) {
    observablesReactions.get(object, key).set(reactionId, { reactionId, roundAdded })
  } else {
    observablesReactions.set(object, key, new Map([[reactionId, { reactionId, roundAdded }]]))
  }
}

export function addDerivationToObservable(object, key: PropertyKey, derivation: core.Derivation) {
  if (observablesDerivations.has(object, key)) {
    observablesDerivations.get(object, key)
      .set(derivation.id, { derivation, roundSet: derivation.round })
  } else {
    observablesDerivations.set(object, key, new Map(
      [[derivation.id, { derivation, roundSet: derivation.round }]]
    ))
  }
}

/**
 * Returns all reactions attached to specified observable.
 */
export function getReactionsOfObservable(object: any, key: PropertyKey) {
  if (!observablesReactions.has(object, key)) {
    observablesReactions.set(object, key, new Map())
  }
  return observablesReactions.get(object, key)
}

export function getDerivationsOfObservable(
  object: object, key: PropertyKey
): Map<symbol, { derivation: core.Derivation, roundSet: number }> {
  if (!observablesDerivations.has(object, key)) {
    observablesDerivations.set(object, key, new Map())
  }
  return observablesDerivations.get(object, key)
}

/**
 * Removes the reaction from the observable's collections of reactions.
 */
export function removeReactionFromObservable(
  object: object, key: PropertyKey, reactionId: symbol,
) {
  if (observablesReactions.has(object, key)) {
    observablesReactions.get(object, key).delete(reactionId)
  }
}

export function removeDerivationFromObservable(
  object: object, key: PropertyKey, derivationId: symbol
) {
  if (observablesDerivations.has(object, key)) {
    observablesDerivations.get(object, key).delete(derivationId)
  }
}
