import { identifiers, ComputedTypeDescriptor } from '../core'

export function computed<T>(fn: (self?, root?) => T): T {
  const descriptor: ComputedTypeDescriptor<T> = {
    identifier: identifiers.computed, fn,
  }
  return descriptor as any as T
}
