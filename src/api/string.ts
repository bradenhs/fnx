import { descriptionTypes, StringDescriptor } from '../core'

const descriptor: StringDescriptor = {
  type: descriptionTypes.string,
  readonly: false, optional: false,
}

/**
 * Describes a string
 * https://fnx.js.org/docs/api/string.html
 */
export const string = descriptor as any as string
