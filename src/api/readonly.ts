import { types } from '../core'

export function readonly(target, key) {
  if (target[types.readonly] == undefined) {
    target[types.readonly] = {}
  }
  target[types.readonly][key] = key
}
