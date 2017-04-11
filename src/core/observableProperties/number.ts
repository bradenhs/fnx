import * as core from '../../core'

export const numberProperty: core.Property = {
  set(target, key, value) {
    if (value === null || typeof value === 'number') {
      const didChange = value !== target[key]
      return {
        didChange, result: Reflect.set(target, key, value)
      }
    } else {
      throw new Error('Bad types number')
    }
  },
  get(target, key) {
    return target[key]
  }
}
