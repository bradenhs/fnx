import * as core from '../core'
import { KeyedObject, PropertyKeyMap, SymbolMap } from '../utils'

export type ObservableMap =
  WeakMap<KeyedObject, PropertyKeyMap<SymbolMap<symbol>>>

export type Property = {
  set: (target?: object, key?: PropertyKey, value?: any,
        description?: core.Descriptor, root?: object) => { didChange: boolean, result: boolean }
  get: (target?: object, key?: PropertyKey, description?: core.Descriptor,
        root?: object, proxy?: object) => any
}

// Map of all of the observables in the app. Uses both the object and it's key
// to designate a particular observable. Is held in memory as a weak map so it
// can be garbage collected.
const observables: ObservableMap = new WeakMap()

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

  if (!setResult.didChange) {
    core.addObservablesReactionsToPendingReactions(target, key)
  }

  return setResult.result
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

  if (core.isReactionInProgress()) {
    if (description.type === core.descriptionTypes.action) {
      throw new Error('Actions should not be accessed in reactions')
    }
    addReactionToObservable(target, key, core.getActiveReactionId())
  }

  return get(target, key, description, root, proxy)
}

/**
 * Ensures the object and key combination has an entry in the
 * the observables map.
 */
function ensureObservableIsDefined(obj: KeyedObject, key: PropertyKey) {
  if (!observables.has(obj)) {
    observables.set(obj, { })
  }
  if (observables.get(obj)[key] == undefined) {
    observables.get(obj)[key] = { }
  }
}

/**
 * Registers a reaction with an observable so when the observable is mutated it
 * can know to trigger this reaction.
 */
function addReactionToObservable(
  object: any, key: PropertyKey, reactionId: symbol,
) {
  ensureObservableIsDefined(object, key)
  observables.get(object)[key][reactionId] = reactionId
}

/**
 * Returns all reactions attached to specified observable.
 */
export function getReactionsOfObservable(object: any, key: PropertyKey) {
  ensureObservableIsDefined(object, key)
  return observables.get(object)[key]
}

/**
 * Removes the reaction from the observable's collections of reactions.
 */
export function removeReactionFromObservable(
  object: KeyedObject, key: PropertyKey, reactionId: symbol,
) {
  ensureObservableIsDefined(object, key)
  const {
    [reactionId]: _,
    ...remainingReactions,
  } = observables.get(object)[key]
  observables.get(object)[key] = remainingReactions
}
