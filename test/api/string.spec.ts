import { string } from '../../src/api'
import { types } from '../../src/core'

describe('string', () => {

  it('should be a string descriptor', () => {
    const actual = string
    const expected = {
      type: types.string,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
