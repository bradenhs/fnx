import { arrayOf as typedArrayOf, computed, number  } from '../../src/api'
import { descriptionTypes } from '../../src/core'
import { catchErrType } from '../testHelpers'

const arrayOf = typedArrayOf as any

describe('arrayOf', () => {

  it('should be a function', () => {
    const actual = typeof arrayOf
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with zero parameters', () => {
    const actual = catchErrType(() => arrayOf())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with two or more parameters', () => {
    const actual = catchErrType(() => arrayOf(number, 'extra'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "string"', () => {
    const actual = catchErrType(() => arrayOf('string'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "number"', () => {
    const actual = catchErrType(() => arrayOf(0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => arrayOf(true))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "function"', () => {
    const actual = catchErrType(() => arrayOf(() => 0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return an arrayOf descriptor', () => {
    const kind = {
      type: descriptionTypes.boolean, readonly: false, optional: false,
    }
    const actual = arrayOf(kind)
    const expected = {
      type: descriptionTypes.arrayOf, kind,
      readonly: false, optional: false
    }

    expect(actual).toEqual(expected)
  })

})
