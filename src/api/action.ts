import { ActionDescriptor, descriptionTypes } from '../core'

/**
 * Describes an action. Actions are used to mutate state.
 * https://fnx.js.org/docs/api/action.html
 * @param action A composition of two functions the first taking the context the second taking args
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
    type: descriptionTypes.action, fn
  }
  return descriptor as any as T
}
