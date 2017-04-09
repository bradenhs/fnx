import * as core from '../core'

/**
 * The base every model must inherit from.
 *
 * **https://fnx.js.org/docs/api/Model.html**
 */
export abstract class Model<Root extends object> {
  /**
   * Creates a new state tree with the given intial value.
   *
   * **https://fnx.js.org/docs/api/Model.html**
   *
   * @param initialState The initial value of the state tree.
   */
  constructor(initialValue: Root) {
    if (!core.isParsingDescription()) {
      core.setParsingDescription(true)
      let description, properties
      try {
        properties = Object.getOwnPropertyNames(new (this.constructor as any)())
        description = core.parseDescription(this.constructor as any)
      } catch(e) {
        core.setParsingDescription(false)
        throw e
      }
      core.setParsingDescription(false)
      const object = { state: undefined }
      core.setIsDeserializingFromPlainObject(true)
      core.objectProperty.set(object, 'state', initialValue, description)
      core.setIsDeserializingFromPlainObject(false)
      properties.forEach(property => {
        core.skipPropertyInitialization(object.state, property)
      })
      return object.state
    }
  }

  /**
   * Returns the root of the state tree.
   *
   * **https://fnx.js.org/docs/api/Model.html**
   */
  protected getRoot?(): Root

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
}
