import { descriptionTypes, parseDescription } from '../../src/core'
import { computed, Model, number } from '../../src/fnx'

describe('computed', () => {

  it('should be a function', () => {
    const actual = typeof computed
    const expected = 'function'

    expect(actual).toEqual(expected)
  })

  it('should return a computed descriptor', () => {
    class App extends Model<App> {
      count = number
      @computed countPlusOne() {
        return this.count + 1
      }
    }

    const description = parseDescription(App)

    const actual = description
    const expected = {
      type: descriptionTypes.object,
      readonly: true,
      optional: false,
      properties: {
        countPlusOne: {
          type: descriptionTypes.computed,
          fn: (App.prototype.countPlusOne as any).fn
        },
        count: {
          type: descriptionTypes.number,
          readonly: false,
          optional: false
        }
      }
    }

    expect(actual).toEqual(expected)
  })

})
