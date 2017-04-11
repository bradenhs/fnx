import * as core from '../../core'

export const actionProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate an action')
  },
  get(_, key, description: core.ActionDescriptor<any>, root, proxy) {
    return core.wrapAction(description.fn, root, proxy, key)
  }
}
