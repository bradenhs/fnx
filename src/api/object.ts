import { types, ObjectDescriptor } from '../core'

/**
 * TODO
 * @param clazz TODO
 */
export function object<T>(clazz: new() => T) {
  const descriptor: ObjectDescriptor<T> = {
    type: types.object, clazz,
    readonly: false, optional: false,
  }
  return descriptor as any as T
}
