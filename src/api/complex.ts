import { identifiers, ComplexTypeDescriptor } from '../core'

export function complex<ComplexType, PrimitiveType extends (number | string | boolean)>(
  serialize: (complexValue: ComplexType) => PrimitiveType,
  deserialize: (primitiveValue: PrimitiveType) => ComplexType,
) {
  const descriptor: ComplexTypeDescriptor<ComplexType, PrimitiveType> = {
    identifier: identifiers.complex, serialize, deserialize,
    readonly: false, optional: false,
  }
  return descriptor as any as ComplexType
};
