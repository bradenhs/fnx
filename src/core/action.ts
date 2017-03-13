const actionsInProgress = new WeakMap<any, number>()

export function incrementActionsInProgress(root) {
  actionsInProgress.set(root, (actionsInProgress.get(root) || 0) + 1)
}

export function decrementActionsInProgress(root) {
  actionsInProgress.set(root, actionsInProgress.get(root) - 1)
}

export function isActionInProgress(root) {
  return actionsInProgress.get(root) > 0
}
