import { identifiers } from '../core'

export function optional(target, key) {
  if (target[identifiers.optional] == undefined) {
    target[identifiers.optional] = {}
  }
  target[identifiers.optional][key] = key
}
