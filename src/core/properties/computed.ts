import * as core from '../../core'

export const computedProperty: core.Property = {
  set: () => {
    throw new Error('You cannot mutate a computed value')
  },
  get: () => {
    throw new Error('TODO canot get computed')
  }
}
