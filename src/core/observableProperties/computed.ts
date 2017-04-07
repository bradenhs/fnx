import * as core from '../../core'

export const computedProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate a computed value')
  },
  get: (_0, key, description: core.ComputedDescriptor<any>, _1, proxy) => {
    return core.wrapComputation(proxy, key, description.fn)
  }
}
