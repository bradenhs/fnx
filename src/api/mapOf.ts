import { identifiers, MapOfTypeDescriptor } from '../core';

export function mapOf<T>(type: T) {
  const descriptor: MapOfTypeDescriptor<T> = {
    identifier: identifiers.mapOf, type,
    readonly: false, optional: false,
  }
  return descriptor as any as {
    [key: string]: T;
    [key: number]: T;
  }
}
