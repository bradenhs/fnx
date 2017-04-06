import { descriptionTypes, parseDescription } from '../../src/core'
import { action as typedAction, Model } from '../../src/fnx'

const action = typedAction as any

describe('action', () => {

  it('should be a function', () => {
    const actual = typeof action
    const expected = 'function'

    expect(actual).toEqual(expected)
  })

  it('should return an action descriptor', () => {
    class App extends Model<App> {
      @action test() { }
    }
    const description = parseDescription(App)
    const actual = description
    const expected = {
      type: descriptionTypes.object,
      readonly: true,
      optional: false,
      properties: {
        test: {
          type: descriptionTypes.action,
          fn: (App.prototype.test as any).fn
        }
      }
    }

    expect(actual).toEqual(expected)
  })

})
