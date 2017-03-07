import { types } from '../core'

export function optional(target, key) {
  if (target[types.optional] == undefined) {
    target[types.optional] = {}
  }
  target[types.optional][key] = key
}
