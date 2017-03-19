// tslint:disable
import { OneOfDescriptor, descriptionTypes } from '../core'

export function oneOf<A, B>(a: A, b: B): A | B
export function oneOf<A, B, C>(a: A, b: B, c: C): A | B | C
export function oneOf<A, B, C, D>(a: A, b: B, c: C, d: D): A | B | C | D
export function oneOf<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): A | B | C | D | E
export function oneOf<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): A | B | C | D | E | F
export function oneOf<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): A | B | C | D | E | F | G
export function oneOf(...kinds: any[]): any
export function oneOf(...kinds: any[]) {
  if (kinds.length < 2) {
    throw new Error()
  }

  kinds.forEach(kind => {
    if (typeof kind !== 'object') {
      throw new Error()
    }

    switch ((kind as any).type) {
      case descriptionTypes.arrayOf:
      case descriptionTypes.boolean:
      case descriptionTypes.complex:
      case descriptionTypes.mapOf:
      case descriptionTypes.number:
      case descriptionTypes.object:
      case descriptionTypes.oneOf:
      case descriptionTypes.string:
        break
      default:
        throw new Error()
    }
  })

  const descriptor: OneOfDescriptor = {
    type: descriptionTypes.oneOf, kinds,
    readonly: false, optional: false,
  }
  return descriptor
}
