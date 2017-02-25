import { identifiers, ComplexTypeDescriptor } from '../core';

export function complex<ComplexType, PrimitiveType extends (number | string | boolean)>(
  serialize: (complexValue: ComplexType) => PrimitiveType,
  deserialize: (primitiveValue: PrimitiveType) => ComplexType,
) {
  return {
    identifier: identifiers.complex,
    serialize, deserialize,
  } as ComplexTypeDescriptor<ComplexType, PrimitiveType> as any as ComplexType;
};
