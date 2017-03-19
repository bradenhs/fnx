import { object as typedObject } from '../../src/api'
import { descriptionTypes } from '../../src/core'
import { catchErrType } from '../testHelpers'

const object = typedObject as any

describe('object', () => {
  it('should be of type "function"', () => {
    const actual = typeof object
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with zero parameters', () => {
    const actual = catchErrType(() => object())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with two or more parameters', () => {
    const actual = catchErrType(() => object(class { }, 'extra'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "number"', () => {
    const actual = catchErrType(() => object(0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "string"', () => {
    const actual = catchErrType(() => object(''))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => object(false))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "object"', () => {
    const actual = catchErrType(() => object({}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return an object descriptor', () => {
    const clazz = class { }
    const actual = object(clazz)
    const expected = {
      type: descriptionTypes.object, clazz,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })
})
