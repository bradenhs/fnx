import * as core from '../core'

let parsing = false

export abstract class Model<StateTreeRoot extends object> {
  constructor(initialState: StateTreeRoot) {
    if (parsing === false) {
      parsing = true
      let description, properties
      try {
        properties = Object.getOwnPropertyNames(new (this.constructor as any)())
        description = core.parseDescription(this.constructor as any)
      } catch(e) {
        parsing = false
        throw e
      }
      parsing = false
      const object = { state: undefined }
      core.objectProperty.set(object, 'state', initialState, description)
      properties.forEach(property => {
        core.skipPropertyInitialization(object.state, property)
      })
      return object.state
    }
  }

  protected getRoot?(): StateTreeRoot {
    return {} as StateTreeRoot
  }

  toString?(): string {
    return ''
  }

  toObject?(): StateTreeRoot {
    return {} as StateTreeRoot
  }

  fromString?(string: string): void {
    console.log(string)
  }

  fromObject?(object: StateTreeRoot): void {
    console.log(object)
  }
}
