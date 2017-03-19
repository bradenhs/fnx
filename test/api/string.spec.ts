import { string } from '../../src/api'
import { descriptionTypes } from '../../src/core'

describe('string', () => {

  it('should be a string descriptor', () => {
    const actual = string
    const expected = {
      type: descriptionTypes.string,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
