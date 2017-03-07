import { types, ComputedDescriptor } from '../core'

export function computed<T>(computation: (self?, root?) => T): T {
  const descriptor: ComputedDescriptor<T> = {
    type: types.computed, computation,
  }
  return descriptor as any as T
}
