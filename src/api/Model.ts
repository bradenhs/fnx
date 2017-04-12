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
  constructor(snapshot: Root) {
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
      core.setIsApplyingSnapshotFromPlainObject(true)
      core.objectProperty.set(object, 'state', snapshot, description)
      core.setIsApplyingSnapshotFromPlainObject(false)
      properties.forEach(property => {
        core.skipPropertyInitialization(object.state, property)
      })
      return object.state
    }
  }

  protected getRoot?(): Root

  applySnapshot?(snapshot: string): boolean
  applySnapshot?(snapshot: object, options?: { asJSON: true }): boolean

  getSnapshot?(): any
  getSnapshot?(options: { asString: true }): string
  getSnapshot?(options: { asJSON: true }): any

  applyDiffs?(diffs: core.Diff[]): boolean

  use?(middleware: core.Middleware): core.Disposable
}
