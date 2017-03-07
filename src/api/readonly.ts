import { types } from '../core'

/**
 * TODO
 * @param target TODO
 * @param key TODO
 */
export function readonly(target, key) {
  if (target[types.readonly] == undefined) {
    target[types.readonly] = {}
  }
  target[types.readonly][key] = key
}
