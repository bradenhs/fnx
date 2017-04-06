import { ActionDescriptor, descriptionTypes } from '../core'

/**
 * Describes an action. Actions are used to mutate state.
 * https://fnx.js.org/docs/api/action.html
 */
export function action(_0, _1, descriptor: TypedPropertyDescriptor<any>) {
  const fn = descriptor.value
  if (typeof fn !== 'function') {
    throw new Error('Actions can only decorate functions')
  }
  descriptor.value = {
    type: descriptionTypes.action, fn
  } as ActionDescriptor<any>
}
