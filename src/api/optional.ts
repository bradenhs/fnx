import { descriptionTypes } from '../core'

/**
 * TODO
 * @param target TODO
 * @param key TODO
 */
export function optional(target, key) {
  if (target[descriptionTypes.optional] == undefined) {
    target[descriptionTypes.optional] = {}
  }
  target[descriptionTypes.optional][key] = key
}
