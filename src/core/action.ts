import {
  getReaction, isValidationOn, getReactionsOfObservable, isInReactionCollection,
  removeReactionFromObservable,
} from '../core';
import {
  AttemptedCallingActionInsideAction, SymbolMap,
  AttemptedTriggeringTransactionInsideTransaction,
} from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * An object that keeps track of reactions which need to be triggered after
 * we've finished executing actions.
 */
let pendingReactions: SymbolMap<symbol> = { };

/**
 * Designates the root id of the observable currently mutating.
 */
let currentlyMutatingObservable: symbol;

/**
 * Designates whether or not a transaction is running.
 */
let transactionRunning = false;

/**
 * Returns whether or not an action is currently running.
 */
export function isActionInProgress(observableId: symbol) {
  return observableId === currentlyMutatingObservable;
}

/**
 * Adds reactions to list of pending reactions to trigger once all actions
 * have stopped running.
 */
export function addObservablesReactionsToPendingReactions(
  obj: any, key: PropertyKey,
) {
  const reactionIds = getReactionsOfObservable(obj, key);

  Object
    .getOwnPropertySymbols(reactionIds)
    .forEach(reactionId => {
      // Make sure this reaction is still in the reaction collection and that
      // it hasn't been disposed. If it was disposed make sure this observable
      // no longer triggers this reaction.
      if (isInReactionCollection(reactionId)) {
        pendingReactions[reactionId] = reactionId;
      } else {
        removeReactionFromObservable(obj, key, reactionId);
      }
    });
}

/**
 * TODO
 */
export function runTransaction(fn: () => void) {
  if (NODE_ENV !== 'production' && isValidationOn() &&
      transactionRunning === true) {
    throw new AttemptedTriggeringTransactionInsideTransaction();
  }
  transactionRunning = true;
  fn();
  transactionRunning = false;
  triggerReactions();
}

/**
 * Wrap actions so they are awesome
 */
export function wrapActions(proxy, rootId, actions) {
  Object.getOwnPropertyNames(actions).forEach(actionName => {
    const boundAction = actions[actionName].bind(proxy);
    actions[actionName] = (...args: any[]) => {
      if (NODE_ENV !== 'production' && isValidationOn() &&
          currentlyMutatingObservable != undefined) {
        throw new AttemptedCallingActionInsideAction();
      }
      currentlyMutatingObservable = rootId;
      boundAction(...args);
      currentlyMutatingObservable = undefined;
      if (!transactionRunning) {
        triggerReactions();
      }
    };
  });
}

/**
 * Trigger all pending reactions and clear the pending reactions.
 */
function triggerReactions() {
  Object.getOwnPropertySymbols(pendingReactions)
      .map(id => getReaction(id))
      .forEach(r => r.invoke());

  // Reset pending reactions
  pendingReactions = { };
}
