import { boolean } from '../src/api/boolean'
import { types } from '../src/core'

describe('boolean', () => {

  it('should be a boolean descriptor', () => {
    const actual = boolean
    const expected = {
      type: types.boolean,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
