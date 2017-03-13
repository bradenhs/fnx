const actionsInProgress = new WeakMap<any, number>()

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
