import { ComputedDescriptor, descriptionTypes } from '../core'

/**
 * Describes a computed value.
 * https://fnx.js.org/docs/api/computed.html
 */
export function computed(_0, _1, descriptor: TypedPropertyDescriptor<any>) {
  const fn = descriptor.value
  if (typeof fn !== 'function') {
    throw new Error('@computed can only decorate functions')
  }
  descriptor.value = {
    type: descriptionTypes.computed, fn
  } as ComputedDescriptor<any>
}
