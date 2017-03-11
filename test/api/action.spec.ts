import { action as typedAction } from '../../src/api/action'
import { types } from '../../src/core'
import { catchErrType } from '../testHelpers'

const action = typedAction as any

describe('action', () => {

  it('should be a function', () => {
    const actual = typeof action
    const expected = 'function'

    expect(actual).toEqual(expected)
  })

  it('should throw `InvalidActionUage` with zero parameters', () => {
    const actual = catchErrType(() => action())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with two or more parameters', () => {
    const actual = catchErrType(() => action(() => 0, 'second'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidActionUage` with parameter of type "string"', () => {
    const actual = catchErrType(() => action('string'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "number"', () => {
    const actual = catchErrType(() => action(0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "boolean"', () => {
    const actual = catchErrType(() => action(true))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with parameter of type "object"', () => {
    const actual = catchErrType(() => action({}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return an action descriptor', () => {
    const fn = () => () => 0
    const actual = action(fn)
    const expected = { type: types.action, fn }

    expect(actual).toEqual(expected)
  })

})
