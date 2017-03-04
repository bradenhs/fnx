import { identifiers, NumberTypeDescriptor } from '../core'

const descriptor: NumberTypeDescriptor = {
  identifier: identifiers.number,
  readonly: false, optional: false,
}

export const number = descriptor as any as number
