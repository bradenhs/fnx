import { BooleanDescriptor, descriptionTypes } from '../core'

const descriptor: BooleanDescriptor = {
  type: descriptionTypes.boolean,
  readonly: false, optional: false,
}

export const boolean = descriptor as any as boolean
