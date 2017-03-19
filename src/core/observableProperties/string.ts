import * as core from '../../core'

export const stringProperty: core.Property = {
  set(target, key, value) {
    if (value == undefined || typeof value === 'string') {
      const didChange = value !== target[key]
      return {
        didChange, result: Reflect.set(target, key, value)
      }
    } else {
      throw new Error('Bad types string')
    }
  },
  get(target, key) {
    return target[key]
  }
}
