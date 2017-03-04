import { identifiers, OneOfTypeDescriptor } from '../core'

export function oneOf<A, B>(a: A, b: B): A | B
export function oneOf<A, B, C>(a: A, b: B, c: C): A | B | C
export function oneOf<A, B, C, D>(a: A, b: B, c: C, d: D): A | B | C | D
export function oneOf<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): A | B | C | D | E
export function oneOf<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): A | B | C | D | E | F
export function oneOf<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): A | B | C | D | E | F | G
export function oneOf(...types: any[]): any
export function oneOf(...types: any[]) {
  const descriptor: OneOfTypeDescriptor = {
    identifier: identifiers.oneOf, types,
    readonly: false, optional: false,
  }
  return descriptor
}
