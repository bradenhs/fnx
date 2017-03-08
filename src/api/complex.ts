import { ComplexDescriptor, types } from '../core'
import * as Errors from '../errors'

/**
 * TODO
 * @param serialize TODO
 * @param deserialize TODO
 */
export function complex<ComplexType, PrimitiveType extends (number | string | boolean)>(
  serialize: (complexValue: ComplexType) => PrimitiveType,
  deserialize: (primitiveValue: PrimitiveType) => ComplexType,
) {
  if (arguments.length < 2) {
    throw new Errors.InvalidComplexUsage()
  }

  if (arguments.length > 2) {
    throw new Errors.InvalidComplexUsage()
  }

  if (typeof serialize !== 'function' || typeof deserialize !== 'function') {
    throw new Errors.InvalidComplexUsage()
  }

  const descriptor: ComplexDescriptor<ComplexType, PrimitiveType> = {
    type: types.complex, serialize, deserialize,
    readonly: false, optional: false,
  }
  return descriptor as any as ComplexType
};
