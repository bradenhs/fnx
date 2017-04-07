import { ArrayOfDescriptor, descriptionTypes } from '../core'

/**
 * Describe an array. Pass in a type to specify type of array elements.
 *
 * **https://fnx.js.org/docs/api/arrayOf.html**
 *
 * @param kind The type of elements in the array
 */
export function arrayOf<T>(kind: T) {
  if (arguments.length === 0) {
    throw new Error()
  }

  if (arguments.length > 1) {
    throw new Error()
  }

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

  const descriptor: ArrayOfDescriptor<T> = {
    type: descriptionTypes.arrayOf, kind,
    readonly: false, optional: false,
  }

  return descriptor as any as {
    /**
     * Serializes the fnx array into a json string.
     *
     * **https://fnx.js.org/docs/api/toString.html**
     */
    toString?(): string

    /**
     * Serializes the fnx object into a json object
     *
     * **https://fnx.js.org/docs/api/toJSON.html**
     */
    toJSON?(): object

    /**
     * Parses the given value into the fnx object.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param json The json string or object compatible with this fnx object.
     */
    parse?(json: string | object)
  } & T[]
}
