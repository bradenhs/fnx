import { identifiers, ArrayOfTypeDescriptor } from '../core';

export function arrayOf<T>(type: T) {
  return {
    identifier: identifiers.arrayOf, type,
  } as ArrayOfTypeDescriptor<T> as any as T[];
}
