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
     * Serializes the fnx object into a json string.
     *
     * **https://fnx.js.org/docs/api/toString.html**
     */
    toString?(): string

    /**
     * Converts the fnx object into a plain js object. If `{ serializeComplex: true }` is passed in
     * then all complex properties will be in their serialized form. `serializeComplex` defaults to
     * false.
     *
     * **https://fnx.js.org/docs/api/toJSON.html**
     *
     * @param options (Optional) Pass in `{ serializeComplex: true }` to return serialized versions
     * of complex properties
     */
    getSnapshot?(options?: { serializeComplex: boolean }): any

    /**
     * Parses the given json string into the fnx object.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param string The json string compatible with this fnx object.
     */
    parse?(string: string)

    /**
     * Parses the given object into the fnx object. If `{ asJSON: true }` is passed in as the second
     * parameter then all complex properties on the given object will be treated as if they are
     * serialized and will be run through their respective deserialization functions. `asJSON`
     * defaults to false.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param object The js object compatible with this fnx object.
     * @param options (Optional) Pass in `{ asJSON: true }` to treat the given object as JSON
     */
    parse?(object: object, options?: { asJSON: boolean })
  } & T[]
}
