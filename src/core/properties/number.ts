import * as core from '../../core'

export const numberProperty: core.Property = {
  set(target, key, value) {
    if (value == undefined || typeof value === 'number') {
      return Reflect.set(target, key, value)
    } else {
      throw new Error('Bad types number')
    }
  },
  get(target, key) {
    return target[key]
  }
}
