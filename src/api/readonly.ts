import { descriptionTypes } from '../core'

/**
 * Marks a property in the state tree as readonly
 * https://fnx.js.org/docs/api/readonly.html
 */
export function readonly(target, key) {
  if (target[descriptionTypes.readonly] == undefined) {
    target[descriptionTypes.readonly] = {}
  }
  target[descriptionTypes.readonly][key] = key
}
