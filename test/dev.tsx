import { descriptionTypes, parseDescription } from '../src/core'
import { Model, string } from '../src/fnx'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('test', () => {
  it('should initialize state properly', () => {
    class Description extends Model<Description> {
      str = string
    }

    const actual = parseDescription(Description)
    const expected = {
      readonly: true,
      optional: false,
      type: descriptionTypes.object,
      properties: {
        str: {
          readonly: false,
          optional: false,
          type: descriptionTypes.string
        }
      }
    }

    expect(actual).toEqual(expected)
  })
})
