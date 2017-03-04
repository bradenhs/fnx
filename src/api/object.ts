import { identifiers, ObjectTypeDescriptor } from '../core'

export function object<T>(type: new() => T) {
  const descriptor: ObjectTypeDescriptor<T> = {
    identifier: identifiers.object, type,
    readonly: false, optional: false,
  }
  return descriptor as any as T
}
