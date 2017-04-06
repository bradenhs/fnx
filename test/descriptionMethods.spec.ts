import { Model } from '../src/fnx'
import { catchErrType } from './testHelpers'

describe('test', () => {
  it('should allow normal methods', () => {
    class App extends Model<App> {
      returnHello?() {
        return 'hello'
      }
    }

    const initialAppState: App = { }

    const app = new App(initialAppState)

    const actual = app.returnHello()
    const expected = 'hello'

    expect(actual).toBe(expected)
  })

  it('should not allow assignment of class methods', () => {
    class App extends Model<App> {
      returnHello() {
        return 'hello'
      }
    }

    const initialAppState: App = {
      returnHello() {
        return 'hi'
      }
    }

    const actual = catchErrType(() => new App(initialAppState))
    const expected = Error

    expect(actual).toBe(expected)
  })
})
