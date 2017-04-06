import { boolean, computed, number, oneOf as typedOneOf, string } from '../../src/api'
import { descriptionTypes } from '../../src/core'
import { catchErrType } from '../testHelpers'

const oneOf = typedOneOf as any

describe('oneOf', () => {
  it('should be of type "function"', () => {
    const actual = typeof oneOf
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with less than two parameters', () => {
    const actual = catchErrType(() => oneOf(number))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "string"', () => {
    const actual = catchErrType(() => oneOf(number, 'string'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "number"', () => {
    const actual = catchErrType(() => oneOf(number, 0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => oneOf(number, true))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return a valid "oneOf" descriptor with two parameters', () => {
    const actual = oneOf(number, string)
    const expected = {
      type: descriptionTypes.oneOf, kinds: [ number, string ],
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

  it('should return a valid "oneOf" descriptor with three parameters', () => {
    const actual = oneOf(number, string, boolean)
    const expected = {
      type: descriptionTypes.oneOf, kinds: [ number, string, boolean ],
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })
})
