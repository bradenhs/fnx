import { descriptionTypes } from '../core'

/**
 * TODO
 * @param target TODO
 * @param key TODO
 */
export function readonly(target, key) {
  if (target[descriptionTypes.readonly] == undefined) {
    target[descriptionTypes.readonly] = {}
  }
  target[descriptionTypes.readonly][key] = key
}
