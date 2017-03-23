import { ComputedDescriptor, descriptionTypes } from '../core'

/**
 * Describes a computed value. Takes a function to run when computing the value. This function
 * should be pure.
 * @param computation The computation to performs. The current and root context are passed in.
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
