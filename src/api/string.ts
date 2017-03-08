import { StringDescriptor, types } from '../core'

const descriptor: StringDescriptor = {
  type: types.string,
  readonly: false, optional: false,
}

export const string = descriptor as any as string
