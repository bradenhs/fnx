import { OneOfDescriptor, types } from '../core'

export function oneOf<A, B>(a: A, b: B): A | B
export function oneOf<A, B, C>(a: A, b: B, c: C): A | B | C
export function oneOf<A, B, C, D>(a: A, b: B, c: C, d: D): A | B | C | D
export function oneOf<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): A | B | C | D | E
export function oneOf<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): A | B | C | D | E | F
export function oneOf<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): A | B | C | D | E | F | G // tslint:disable-line
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
      case types.arrayOf:
      case types.boolean:
      case types.complex:
      case types.mapOf:
      case types.number:
      case types.object:
      case types.oneOf:
      case types.string:
        break
      default:
        throw new Error()
    }
  })

  const descriptor: OneOfDescriptor = {
    type: types.oneOf, kinds,
    readonly: false, optional: false,
  }
  return descriptor
}
