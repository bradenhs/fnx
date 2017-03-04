import { identifiers } from '../core'

export function readonly(target, key) {
  if (target[identifiers.readonly] == undefined) {
    target[identifiers.readonly] = {}
  }
  target[identifiers.readonly][key] = key
}
