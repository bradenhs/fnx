import { identifiers, ComputedTypeDescriptor } from '../core';

export function computed<T>(fn: () => T) {
  return {
    identifier: identifiers.computed, fn,
  } as ComputedTypeDescriptor<T> as any as T;
}
