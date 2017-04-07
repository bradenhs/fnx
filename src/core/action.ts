import * as core from '../core'

const actionsInProgress = new WeakMap<any, number>()

/**
 * An object that keeps track of reactions which need to be triggered after
 * we've finished executing actions.
 */
const pendingReactions = new Map<symbol, symbol>()

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
  const reactions = core.getReactionsOfObservable(target, key)

  reactions.forEach(({ reactionId, roundAdded }) => {
    // Make sure this reaction is still in the reaction collection and that
    // it hasn't been disposed. If it was disposed make sure this observable
    // no longer triggers this reaction. Also make sure this observable's reaction
    // was added on the most recent round for running that reaction. If not get rid of
    // it as well
    const reaction = core.getReaction(reactionId)
    if (core.isInReactionCollection(reactionId) && reaction.round === roundAdded) {
      pendingReactions.set(reactionId, reactionId)
    } else {
      core.removeReactionFromObservable(target, key, reactionId)
    }
  })
}

/**
 * Wrap actions so they are awesome
 */
export function wrapAction(fn: (...args: any[]) => any, root, proxy) {
  return (...args: any[]) => {
    if (core.isReactionInProgress()) {
      throw new Error('Actions should not be called in reactions')
    }
    if (core.isComputationInProgress()) {
      throw new Error('Actions should not be called in computations')
    }
    incrementActionsInProgress(root)
    const result = fn.bind(proxy)(...args)
    decrementActionsInProgress(root)
    if (isActionInProgress(root) === false) {
      triggerReactions()
    }
    return result
  }
}

/**
 * Trigger all pending reactions and clear the pending reactions.
 */
function triggerReactions() {
  pendingReactions.forEach(id => {
    core.getReaction(id).invoke()
  })

  // Reset pending reactions
  pendingReactions.clear()
}
