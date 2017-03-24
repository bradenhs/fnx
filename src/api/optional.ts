import { descriptionTypes } from '../core'

/**
 * Marks a property in the state tree as optional
 * https://fnx.js.org/docs/api/optional.html
 */
export function optional(target, key) {
  if (target[descriptionTypes.optional] == undefined) {
    target[descriptionTypes.optional] = {}
  }
  target[descriptionTypes.optional][key] = key
}
