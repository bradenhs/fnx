import { types, NumberDescriptor } from '../core'

const descriptor: NumberDescriptor = {
  type: types.number,
  readonly: false, optional: false,
}

export const number = descriptor as any as number
