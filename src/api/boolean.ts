import { identifiers, BooleanTypeDescriptor } from '../core'

const descriptor: BooleanTypeDescriptor = {
  identifier: identifiers.boolean,
  readonly: false, optional: false,
}

export const boolean = descriptor as any as boolean
