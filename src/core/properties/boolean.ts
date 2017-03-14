import * as core from '../../core'

export const booleanProperty: core.Property = {
  set(target, key, value) {
    if (value == undefined || typeof value === 'boolean') {
      return Reflect.set(target, key, value)
    } else {
      throw new Error('Bad types boolean')
    }
  },
  get(target, key) {
    return target[key]
  }
}
