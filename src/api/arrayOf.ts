import { identifiers, ArrayOfTypeDescriptor } from '../core'

export function arrayOf<T>(type: T) {
  const descriptor: ArrayOfTypeDescriptor<T> = {
    identifier: identifiers.arrayOf, type,
    readonly: false, optional: false,
  }
  return descriptor as any as T[]
}
