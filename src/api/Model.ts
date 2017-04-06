import * as core from '../core'

export abstract class Model<Root extends object> {
  constructor(initialState: Root) {
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
      core.objectProperty.set(object, 'state', initialState, description)
      properties.forEach(property => {
        core.skipPropertyInitialization(object.state, property)
      })
      return object.state
    }
  }

  protected getRoot?(): Root

  toString?(): string

  toJS?(options?: { serializeComplex: boolean }): any

  parse?(jsonString: string)
  parse?(jsObject: object, options?: { asJson: boolean })
  parse?(...args: any[])
}
