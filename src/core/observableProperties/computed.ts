import * as core from '../../core'

export const computedProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate a computed value')
  },
  get: (target, key, description: core.ComputedDescriptor<any>, _, proxy) => {
    return core.wrapDerivation(target, key, description, proxy)
  }
}
