import { descriptionTypes, NumberDescriptor } from '../core'

const descriptor: NumberDescriptor = {
  type: descriptionTypes.number,
  readonly: false, optional: false,
}

/**
 * Describes a number.
 * https://fnx.js.org/docs/api/number.html
 */
export const number = descriptor as any as number
