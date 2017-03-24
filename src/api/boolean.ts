import { BooleanDescriptor, descriptionTypes } from '../core'

const descriptor: BooleanDescriptor = {
  type: descriptionTypes.boolean,
  readonly: false, optional: false,
}

/**
 * Describes a boolean
 * https://fnx.js.org/docs/api/boolean.html
 */
export const boolean = descriptor as any as boolean
