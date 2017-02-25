import { identifiers, ObjectTypeDescriptor } from '../core';

export function object<T>(type: new (initialState?: any) => T) {
  return {
    identifier: identifiers.object, type,
  } as ObjectTypeDescriptor<T> as any as T;
}
