import { number } from '../../src/api'
import { types } from '../../src/core'

describe('number', () => {

  it('should be a number descriptor', () => {
    const actual = number
    const expected = {
      type: types.number,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
