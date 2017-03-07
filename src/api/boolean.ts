import { types, BooleanDescriptor } from '../core'

const descriptor: BooleanDescriptor = {
  type: types.boolean,
  readonly: false, optional: false,
}

export const boolean = descriptor as any as boolean
