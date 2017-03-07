import { types } from '../core'

/**
 * TODO
 * @param target TODO
 * @param key TODO
 */
export function optional(target, key) {
  if (target[types.optional] == undefined) {
    target[types.optional] = {}
  }
  target[types.optional][key] = key
}
