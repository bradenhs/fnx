import { types, ArrayOfDescriptor } from '../core'

export function arrayOf<T>(kind: T) {
  const descriptor: ArrayOfDescriptor<T> = {
    type: types.arrayOf, kind,
    readonly: false, optional: false,
  }
  return descriptor as any as T[]
}
