import { identifiers, StringTypeDescriptor } from '../core'

const descriptor: StringTypeDescriptor = {
  identifier: identifiers.string,
  readonly: false, optional: false,
}

export const string = descriptor as any as string
