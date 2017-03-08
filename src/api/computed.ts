import { ComputedDescriptor, types } from '../core'
import * as Errors from '../errors'

/**
 * TODO
 * @param computation TODO
 */
export function computed<T>(fn: (self?, root?) => T): T {
  if (arguments.length === 0) {
    throw new Errors.InvalidComputedUsage()
  }
  if (arguments.length > 1) {
    throw new Errors.InvalidComputedUsage()
  }
  if (typeof fn !== 'function') {
    throw new Errors.InvalidComputedUsage()
  }

  const descriptor: ComputedDescriptor<T> = {
    type: types.computed, fn,
  }
  return descriptor as any as T
}
