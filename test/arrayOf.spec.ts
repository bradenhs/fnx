import { action } from '../src/api/action'
import { arrayOf as strictArrayOf } from '../src/api/arrayOf'
import { computed } from '../src/api/computed'
import { types } from '../src/core'
import * as Errors from '../src/errors'
import { catchErrType } from './testHelpers'

const arrayOf = strictArrayOf as any

describe('arrayOf', () => {

  it('should be a function', () => {
    const actual = typeof arrayOf
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with zero parameters', () => {
    const actual = catchErrType(() => arrayOf())
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with two or more parameters', () => {
    const actual = catchErrType(() => arrayOf({}, 'extra'))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with parameter of type "string"', () => {
    const actual = catchErrType(() => arrayOf('string'))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with parameter of type "number"', () => {
    const actual = catchErrType(() => arrayOf(0))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => arrayOf(true))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with parameter of type "function"', () => {
    const actual = catchErrType(() => arrayOf(() => 0))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOfUsage` with parameter of type action', () => {
    const actual = catchErrType(() => arrayOf(action(() => () => 0)))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidArrayOf` with parameter of type computed', () => {
    const actual = catchErrType(() => arrayOf(computed(() => 0)))
    const expected = Errors.InvalidArrayOfUsage

    expect(actual).toBe(expected)
  })

  it('should return an arrayOf descriptor', () => {
    const kind = {
      type: types.boolean, readonly: false, optional: false,
    }
    const actual = arrayOf(kind)
    const expected = {
      type: types.arrayOf, kind,
      readonly: false, optional: false
    }

    expect(actual).toEqual(expected)
  })

})
