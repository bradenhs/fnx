import { complex as typedComplex } from '../src/api/complex'
import { types } from '../src/core'
import * as Errors from '../src/errors'
import { catchErrType } from './testHelpers'

const complex = typedComplex as any

describe('complex', () => {

  it('should be a function', () => {
    const actual = typeof complex
    const expected = 'function'

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidComplexUsage` with zero parameters', () => {
    const actual = catchErrType(() => complex())
    const expected = Errors.InvalidComplexUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidComplexUsage` with one parameter', () => {
    const actual = catchErrType(() => complex(() => 0))
    const expected = Errors.InvalidComplexUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidComplexUsage` with three or more parameters', () => {
    const actual = catchErrType(() => complex(() => 0, () => 0, 'extra'))
    const expected = Errors.InvalidComplexUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidComplexUsage` if first parameter is not function', () => {
    const actual = catchErrType(() => complex('', () => 0))
    const expected = Errors.InvalidComplexUsage

    expect(actual).toBe(expected)
  })

  it('should throw `InvalidComplexUsage` if second parameter is not function', () => {
    const actual = catchErrType(() => complex(() => 0, ''))
    const expected = Errors.InvalidComplexUsage

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
