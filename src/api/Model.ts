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
      core.objectProperty.set(object, 'state', initialValue, description)
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
}
