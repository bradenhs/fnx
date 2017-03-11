import { cloneDeep } from 'lodash'
import { readonly, string } from '../../src/api'
import { parseDescription, types } from '../../src/core'

const baseExpectedDescription = {
  readonly: true,
  optional: false,
  properties: { },
  type: types.object,
}

describe('parseDescription', () => {
  it('should parse empty description correctly', () => {
    class Description { }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expect(actual).toEqual(expected)
  })

  it('should parse readonly properties correctly', () => {
    class Description {
      @readonly readonlyString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      readonlyString: {
        readonly: true,
        optional: false,
        type: types.string
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should parse mixed readonly and non-readonly properties correctly', () => {
    class Description {
      @readonly readonlyString = string
      nonReadonlyString = string
    }

    const actual = parseDescription(Description)
    const expected = cloneDeep(baseExpectedDescription)

    expected.properties = {
      readonlyString: {
        readonly: true,
        optional: false,
        type: types.string,
      },
      nonReadonlyString: {
        readonly: false,
        optional: false,
        type: types.string,
      }
    }

    expect(actual).toEqual(expected)
  })
})
