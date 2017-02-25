import { identifiers, MapOfTypeDescriptor } from '../core';

export function mapOf<T>(type: T) {
  return {
    identifier: identifiers.mapOf, type,
  } as MapOfTypeDescriptor<any> as any as {
    [key: string]: T;
    [key: number]: T;
  }
}
