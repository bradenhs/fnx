import { ArrayOfDescriptor, types } from '../core'
import * as Errors from '../errors'

/**
 * TODO
 * @param kind TODO
 */
export function arrayOf<T>(kind: T) {
  if (arguments.length === 0) {
    throw new Errors.InvalidArrayOfUsage()
  }

  if (arguments.length > 1) {
    throw new Errors.InvalidArrayOfUsage()
  }

  if (typeof kind !== 'object') {
    throw new Errors.InvalidArrayOfUsage()
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
      throw new Errors.InvalidArrayOfUsage()
  }

  const descriptor: ArrayOfDescriptor<T> = {
    type: types.arrayOf, kind,
    readonly: false, optional: false,
  }

  return descriptor as any as T[]
}
