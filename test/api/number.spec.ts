import { number } from '../../src/api'
import { descriptionTypes } from '../../src/core'

describe('number', () => {

  it('should be a number descriptor', () => {
    const actual = number
    const expected = {
      type: descriptionTypes.number,
      readonly: false, optional: false,
    }

    expect(actual).toEqual(expected)
  })

})
