import { descriptionTypes, Diff, Disposable, MapOfDescriptor, Middleware } from '../core'

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
    applySnapshot?(snapshot: string): boolean
    applySnapshot?(snapshot: object, options?: { asJSON: true }): boolean

    getSnapshot?(): object
    getSnapshot?(options: { asString: true }): string
    getSnapshot?(options: { asJSON: true }): object

    applyDiffs?(diffs: Diff[]): boolean

    use?(middleware: Middleware): Disposable
  } & {
    [key: string]: T
    [key: number]: T
  }
}
