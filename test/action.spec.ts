import { action as strictAction } from '../src/api/action'
import { types } from '../src/core'
import * as Errors from '../src/errors'
import { catchErrType } from './testHelpers'

const action = strictAction as any

describe('action', () => {

  it('should be a function', () => {
    const actual = typeof action
    const expected = 'function'

    expect(actual).toEqual(expected)
  })

  it('should throw `InvalidActionUage` with zero parameters', () => {
    const actual = catchErrType(() => action())
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with two or more parameters', () => {
    const actual = catchErrType(() => action(() => 0, 'second'))
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with parameter of type "string"', () => {
    const actual = catchErrType(() => action('string'))
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with parameter of type "number"', () => {
    const actual = catchErrType(() => action(0))
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => action(true))
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with parameter of type "object"', () => {
    const actual = catchErrType(() => action({}))
    const expected = Errors.InvalidActionUsage

    expect(actual).toBe(expected)
  })

  it('should return an action descriptor', () => {
    const fn = () => () => 0
    const actual = action(fn)
    const expected = { type: types.action, fn }

    expect(actual).toEqual(expected)
  })

})
