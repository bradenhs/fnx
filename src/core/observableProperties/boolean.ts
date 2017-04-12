import * as core from '../../core'

export const booleanProperty: core.Property = {
  set(target, key, value) {
    if (value == null || typeof value === 'boolean') {
      const didChange = value !== target[key]
      return {
        didChange, result: Reflect.set(target, key, value)
      }
    } else {
      throw new Error('Bad types boolean')
    }
  },
  get(target, key) {
    return target[key]
  }
}
