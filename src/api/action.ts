import { ActionDescriptor, types } from '../core'
import * as Errors from '../errors'

/**
 * TODO
 * @param action TODO
 */
export function action<T extends (...args: any[]) => void>(fn: (self?, root?) => T): T {
  if (arguments.length === 0) {
    throw new Errors.InvalidActionUsage()
  }
  if (arguments.length > 1) {
    throw new Errors.InvalidActionUsage()
  }
  if (typeof fn !== 'function') {
    throw new Errors.InvalidActionUsage()
  }
  const descriptor: ActionDescriptor<T> = {
    type: types.action, fn
  }
  return descriptor as any as T
}
