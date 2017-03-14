import * as core from '../../core'

export const actionProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate an action')
  },
  get(_0, _1, description: core.ActionDescriptor<any>, root, proxy) {
    const action = description.fn(proxy, root)

    if (typeof action !== 'function') {
      throw new Error('Actions should be a function returning another function')
    }

    return (...args: any[]) => {
      core.incrementActionsInProgress(root)
      if (action(...args) != undefined) {
        throw new Error('Actions must not return a value')
      }
      core.decrementActionsInProgress(root)
    }
  }
}
