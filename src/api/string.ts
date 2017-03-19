import { descriptionTypes, StringDescriptor } from '../core'

const descriptor: StringDescriptor = {
  type: descriptionTypes.string,
  readonly: false, optional: false,
}

export const string = descriptor as any as string
