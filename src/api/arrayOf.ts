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
     * Converts the fnx array into a plain javascript object.
     *
     * **https://fnx.js.org/docs/api/toJS.html**
     *
     * @param options (Optional) Pass in { serializeComplex: true } to return serialized version
     * of complex properties.
     */
    toJS?(options?: { serializeComplex: boolean }): any

    /**
     * Parses the given string into the fnx array.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param jsonString The json string compatible with this fnx array.
     */
    parse?(jsonString: string)

    /**
     * Parses the given object into the fnx array.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param jsObject The plain javascript object compatible with this fnx array.
     * @param options (Optional) Pass in { asJson: true } to treat given values for complex
     * properties as their serialized versions.
     */
    parse?(jsObject: object, options?: { asJson: boolean })
  } & T[]
}
