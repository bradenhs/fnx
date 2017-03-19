import { descriptionTypes, NumberDescriptor } from '../core'

const descriptor: NumberDescriptor = {
  type: descriptionTypes.number,
  readonly: false, optional: false,
}

export const number = descriptor as any as number
