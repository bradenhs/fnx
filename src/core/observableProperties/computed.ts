import * as core from '../../core'

export const computedProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate a computed value')
  },
  get: (target, key, description: core.ComputedDescriptor<any>, root, proxy) => {
    const derivation = core.getDerivation(target, key, description)
    if (derivation.stale) {
      return core.runDerivation(derivation, proxy, root)
    } else {
      return derivation.value
    }
  }
}
