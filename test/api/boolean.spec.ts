import { boolean } from '../../src/api/boolean'
import { descriptionTypes } from '../../src/core'

describe('boolean', () => {

  it('should be a boolean descriptor', () => {
    const actual = boolean
    const expected = {
      type: descriptionTypes.boolean,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
