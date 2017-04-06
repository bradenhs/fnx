import { descriptionTypes, MapOfDescriptor } from '../core'

/**
 * Describes a map of the given type.
 * https://fnx.js.org/docs/api/mapOf.html
 * @param kind The type of items this map contains
 */
export function mapOf<T>(kind: T) {
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

  const descriptor: MapOfDescriptor<T> = {
    type: descriptionTypes.mapOf, kind,
    readonly: false, optional: false,
  }

  return descriptor as any as {
    /**
     * Serializes the fnx map into a json string.
     *
     * **https://fnx.js.org/docs/api/toString.html**
     */
    toString?(): string

    /**
     * Converts the fnx map into a plain javascript object.
     *
     * **https://fnx.js.org/docs/api/toJS.html**
     *
     * @param options (Optional) Pass in { serializeComplex: true } to return serialized version
     * of complex properties.
     */
    toJS?(options?: { serializeComplex: boolean }): any

    /**
     * Parses the given string into the fnx map.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param jsonString The json string compatible with this fnx map.
     */
    parse?(jsonString: string)

    /**
     * Parses the given object into the fnx map.
     *
     * **https://fnx.js.org/docs/api/parse.html**
     *
     * @param jsObject The plain javascript object compatible with this fnx map.
     * @param options (Optional) Pass in { asJson: true } to treat given values for complex
     * properties as their serialized versions.
     */
    parse?(jsObject: object, options?: { asJson: boolean })
  } & {
    [key: string]: T
    [key: number]: T
  }
}
