import { descriptionTypes, MapOfDescriptor } from '../core'

/**
 * TODO
 * @param kind TODO
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
    [key: string]: T;
    [key: number]: T;
  }
}
