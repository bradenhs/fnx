import { ArrayOfDescriptor, types } from '../core'

/**
 * TODO
 * @param kind TODO
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

  const descriptor: ArrayOfDescriptor<T> = {
    type: types.arrayOf, kind,
    readonly: false, optional: false,
  }

  return descriptor as any as T[]
}
