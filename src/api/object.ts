import { descriptionTypes, ObjectDescriptor } from '../core'

/**
 * Describes an object in the state tree.
 * https://fnx.js.org/docs/api/object.html
 * @param clazz The class of this object
 */
export function object<T>(clazz: new(initialState?: any) => T) {
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
