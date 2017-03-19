import { descriptionTypes, ObjectDescriptor } from '../core'

/**
 * TODO
 * @param clazz TODO
 */
export function object<T>(clazz: new() => T) {
  if (arguments.length === 0) {
    throw new Error()
  }

  if (arguments.length > 1) {
    throw new Error()
  }

  if (typeof clazz !== 'function') {
    throw new Error()
  }

  const descriptor: ObjectDescriptor<T> = {
    type: descriptionTypes.object, clazz,
    readonly: false, optional: false,
  }
  return descriptor as any as T
}
