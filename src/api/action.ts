import { ActionDescriptor, types } from '../core'

/**
 * TODO
 * @param action TODO
 */
export function action<T extends (...args: any[]) => void>(fn: (self?, root?) => T): T {
  if (arguments.length === 0) {
    throw new Error()
  }
  if (arguments.length > 1) {
    throw new Error()
  }
  if (typeof fn !== 'function') {
    throw new Error()
  }
  const descriptor: ActionDescriptor<T> = {
    type: types.action, fn
  }
  return descriptor as any as T
}
