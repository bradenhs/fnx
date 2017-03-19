import * as core from '../core'
import { SymbolMap } from '../utils'

const actionsInProgress = new WeakMap<any, number>()

/**
 * An object that keeps track of reactions which need to be triggered after
 * we've finished executing actions.
 */
let pendingReactions: SymbolMap<symbol> = { }

/**
 * Increments the actions in progress for a particular state tree
 * @param root The root of the state tree you are incrementing
 */
export function incrementActionsInProgress(root) {
  actionsInProgress.set(root, (actionsInProgress.get(root) || 0) + 1)
}

/**
 * Decrements the actions in progress for a particular state tree
 * @param root The root of the state tree you are decrementing
 */
export function decrementActionsInProgress(root) {
  actionsInProgress.set(root, actionsInProgress.get(root) - 1)
}

/**
 * Returns whether or not this state tree has any actions in progress
 * @param root The root of the state tree you are testing
 */
export function isActionInProgress(root) {
  return actionsInProgress.get(root) > 0
}

/**
 * Adds reactions to list of pending reactions to trigger once all actions
 * have stopped running.
 */
export function addObservablesReactionsToPendingReactions(
  target: any, key: PropertyKey,
) {
  const reactionIds = core.getReactionsOfObservable(target, key)

  Object
    .getOwnPropertySymbols(reactionIds)
    .forEach(reactionId => {
      // Make sure this reaction is still in the reaction collection and that
      // it hasn't been disposed. If it was disposed make sure this observable
      // no longer triggers this reaction.
      if (core.isInReactionCollection(reactionId)) {
        pendingReactions[reactionId] = reactionId
      } else {
        core.removeReactionFromObservable(target, key, reactionId)
      }
    })
}

/**
 * Wrap actions so they are awesome
 */
export function wrapAction(description: core.ActionDescriptor<any>, root, proxy) {
  const action = description.fn(proxy, root)

  if (typeof action !== 'function') {
    throw new Error('Actions have a context function wrapping the inner one')
  }

  return (...args: any[]) => {
    incrementActionsInProgress(root)
    if (action(...args) != undefined) {
      throw new Error('Actions must not return stuff')
    }
    decrementActionsInProgress(root)
    if (isActionInProgress(root) === false) {
      triggerReactions()
    }
  }
}

/**
 * Trigger all pending reactions and clear the pending reactions.
 */
function triggerReactions() {
  Object.getOwnPropertySymbols(pendingReactions)
      .map(id => core.getReaction(id))
      .forEach(r => r.invoke())

  // Reset pending reactions
  pendingReactions = { }
}
