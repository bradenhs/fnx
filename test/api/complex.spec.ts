import { complex as typedComplex } from '../../src/api/complex'
import { types } from '../../src/core'
import { catchErrType } from '../testHelpers'

const complex = typedComplex as any

describe('complex', () => {

  it('should be a function', () => {
    const actual = typeof complex
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with zero parameters', () => {
    const actual = catchErrType(() => complex())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with one parameter', () => {
    const actual = catchErrType(() => complex(() => 0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` with three or more parameters', () => {
    const actual = catchErrType(() => complex(() => 0, () => 0, 'extra'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` if first parameter is not function', () => {
    const actual = catchErrType(() => complex('', () => 0))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should throw `Error` if second parameter is not function', () => {
    const actual = catchErrType(() => complex(() => 0, ''))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should return a complex descriptor', () => {
    const serialize = d => d.valueOf()
    const deserialize = v => new Date(v)

    const actual = complex(serialize, deserialize)
    const expected = {
      type: types.complex, serialize, deserialize,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })
})
