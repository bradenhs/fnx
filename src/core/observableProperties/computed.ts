import * as core from '../../core'
import { ObjectKeyWeakMap } from '../../utils'

interface ComputedValue {
  value: any
  stale: boolean
}

const computedValues = new ObjectKeyWeakMap<any, ComputedValue>()

let activeComputation: { target: any, key: any }

export const computedProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate a computed value')
  },
  get: (target, key, description: core.ActionDescriptor<any>, root, proxy) => {
    if (computedValues.has(target, key) === false || computedValues.get(target, key).stale) {
      const previousActiveComputation = activeComputation
      activeComputation = { target, key }
      const result = description.fn(proxy, root)
      activeComputation = previousActiveComputation
      computedValues.set(target, key, { value: result, stale: false })
      return result
    } else {
      return computedValues.get(target, key).value
    }
  }
}
