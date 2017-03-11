import { MapOfDescriptor, types } from '../core'

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
    case types.arrayOf:
    case types.boolean:
    case types.complex:
    case types.mapOf:
    case types.number:
    case types.object:
    case types.oneOf:
    case types.string:
      break
    default:
      throw new Error()
  }

  const descriptor: MapOfDescriptor<T> = {
    type: types.mapOf, kind,
    readonly: false, optional: false,
  }

  return descriptor as any as {
    [key: string]: T;
    [key: number]: T;
  }
}
