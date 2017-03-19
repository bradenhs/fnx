import { ComputedDescriptor, descriptionTypes } from '../core'

/**
 * TODO
 * @param computation TODO
 */
export function computed<T>(fn: (self?, root?) => T): T {
  if (arguments.length === 0) {
    throw new Error()
  }
  if (arguments.length > 1) {
    throw new Error()
  }
  if (typeof fn !== 'function') {
    throw new Error()
  }

  const descriptor: ComputedDescriptor<T> = {
    type: descriptionTypes.computed, fn,
  }
  return descriptor as any as T
}
