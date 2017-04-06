import { computed, mapOf as typedMapOf, number } from '../../src/api'
import { descriptionTypes } from '../../src/core'
import { catchErrType } from '../testHelpers'

const mapOf = typedMapOf as any

describe('mapOf', () => {

  it('should be a function', () => {
    const actual = typeof mapOf
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with zero parameters', () => {
    const actual = catchErrType(() => mapOf())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with two or more parameters', () => {
    const actual = catchErrType(() => mapOf(number, 'extra'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "string"', () => {
    const actual = catchErrType(() => mapOf('string'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "number"', () => {
    const actual = catchErrType(() => mapOf(0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => mapOf(true))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "function"', () => {
    const actual = catchErrType(() => mapOf(() => 0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return an mapOf descriptor', () => {
    const kind = {
      type: descriptionTypes.boolean, readonly: false, optional: false,
    }
    const actual = mapOf(kind)
    const expected = {
      type: descriptionTypes.mapOf, kind,
      readonly: false, optional: false
    }

    expect(actual).toEqual(expected)
  })
})
