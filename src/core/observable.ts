import {
  isObservable, isObservableDesignator, isPrimitive,
  AttemptedMutationOutsideAction, AttemptedMutationOfAction,
  ActionCollection, ObservableMap,
} from '../utils';
import {
  isReactionInProgress, getActiveReactionId,
  isActionInProgress, addObservablesReactionsToPendingReactions,
} from '../core';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

// Use this counter to determine if we're currently creating an observable. This
// is important because the normal rules for actions and reactions don't apply
// when first initializing the object.
let creatingObservableCounter = 0;

// Map of all of the observables in the app. Uses both the object and it's key
// to designate a particular observable. Is held in memory as a weak map so it
// can be garbage collected.
const observables: ObservableMap = new WeakMap();

/**
 * Internal create observable function. Actions should only be defined at the
 * root of the observable - everywhere else they will be omitted from the call.
 */
export function createObservable<T, U>(
  object: T & object, rootId: symbol, actions?: U & ActionCollection<T>,
): T & U | T {
  // If this is a primitive it can't be observed. If it's already an observable
  // it doesn't need to be observed again.
  if (isPrimitive(object) || isObservable(object)) {
    return object;
  }

  // Increment the creating observable counter to indicate we've entered another
  // createObservable function call.
  creatingObservableCounter++;

  // Create a transparent proxy for this object
  const proxy = new Proxy(object, {
    get: createGetter(object, actions),
    set: createSetter(object, rootId, actions),
  });

  // Get all of the object's property names (not just the enumerable ones)
  [ ...Object.getOwnPropertyNames(proxy),
    ...Object.getOwnPropertySymbols(proxy),
  ].forEach(key => {
    // Recursively create observables out of this object's properties
    proxy[key] = createObservable(proxy[key], rootId);
  });

  // Decrement the creatingObservableCounter to indicate we're leaving
  // a createObservable call
  creatingObservableCounter--;

  return proxy;
}

/**
 * Factory to create getter for observable. TODO make this a prototype method
 */
function createGetter<T>(object: T, actions?: ActionCollection<T>) {
  return (target, key, receiver) => {
    // Is this the special key created to distinguish if an object
    // is an observable?
    if (isObservableDesignator(key)) {
      return true;
    }

    // If this key matches an action return the action instead.
    if (actions !== undefined && actions[key] !== undefined) {
      // Use Reflect.get to ensure 'this' of actions[key] === object.
      return actions[key];
    }

    // If we're in a reaction add this reaction to the observable's list of
    // reactions so it can be triggered later when this observable is
    // modified.
    if (isReactionInProgress()) {
      addReactionToObservable(
        object, key, getActiveReactionId(),
      );
    }

    // Use the reflect api to get so that the correct value of this is used in
    // case we encounter a getter.
    return Reflect.get(target, key, receiver);
  };
}

/**
 * Factory to create setter for observable.
 */
function createSetter<T>(
  object: T, rootId: symbol, actions?: ActionCollection<T>,
) {
  return (target, key, value, receiver) => {
    // Only run this section if not creating an observable
    if (creatingObservableCounter === 0) {
      // Mutating observable is only allowed when inside of an action
      if (NODE_ENV !== 'production' && !isActionInProgress(rootId)) {
        throw new AttemptedMutationOutsideAction();
      }

      // Ensure they're not trying to mutate an action.
      if (NODE_ENV !== 'production' && actions != undefined &&
          actions[key] != undefined) {
        throw new AttemptedMutationOfAction();
      }

      // If the values are the same skip the actual assignment and adding this
      // as a reaction.
      if (Reflect.get(target, key, receiver) === value) {
        return true;
      }

      // Add observables reactions to the list of reactions to trigger when all
      // action functions currently in progress have finished executing.
      addObservablesReactionsToPendingReactions(object, key);
    }

    // Use reflect api to set so that receiver is the expected value of this
    return Reflect.set(target, key, createObservable(value, rootId), receiver);
  };
}

/**
 * Ensures the object and key combination has an entry in the
 * the observables map.
 */
function ensureObservableIsDefined(obj: object, key: PropertyKey) {
  if (!observables.has(obj)) {
    observables.set(obj, { });
  }
  if (observables.get(obj)[key] == undefined) {
    observables.get(obj)[key] = { };
  }
}

/**
 * Registers a reaction with an observable so when the observable is mutated it
 * can know to trigger this reaction.
 */
function addReactionToObservable(
  object: any, key: PropertyKey, reactionId: symbol,
) {
  ensureObservableIsDefined(object, key);
  observables.get(object)[key][reactionId] = reactionId;
}

/**
 * Returns all reactions attached to specified observable.
 */
export function getReactionsOfObservable(object: any, key: PropertyKey) {
  ensureObservableIsDefined(object, key);
  return observables.get(object)[key];
}

/**
 * Removes the reaction from the observable's collections of reactions.
 */
export function removeReactionFromObservable(
  object: object, key: PropertyKey, reactionId: symbol,
) {
  ensureObservableIsDefined(object, key);
  const {
    [reactionId]: _,
    ...remainingReactions,
  } = observables.get(object)[key];
  observables.get(object)[key] = remainingReactions;
}
