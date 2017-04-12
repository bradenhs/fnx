import fnx, { Model } from '../../src/fnx'
import { catchErrType } from '../testHelpers'

describe('enforce null bottom value', () => {
  test('optional properties should be deletable', () => {
    class App extends Model<App> {
      @fnx.optional
      hello? = fnx.string

      @fnx.action
      deleteHello?() {
        delete this.hello
      }
    }

    const app = new App({ hello: 'hi' })

    app.deleteHello()

    const actual = Object.getOwnPropertyNames(app)
    const expected = []

    expect(actual).toEqual(expected)
  })
  test('required properties should not be deleteable', () => {
    class App extends Model<App> {
      hello = fnx.string

      @fnx.action
      deleteHello?() {
        delete this.hello
      }
    }

    const app = new App({ hello: 'hi' })

    const actual = catchErrType(() => app.deleteHello())
    const expected = Error

    expect(actual).toBe(expected)
  })
  test('values cannot be assigned to undefined', () => {
    class App extends Model<App> {
      hello = fnx.string

      @fnx.action
      assignUndefined?() {
        this.hello = undefined
      }
    }

    const app = new App({ hello: 'hi' })

    const actual = catchErrType(() => app.assignUndefined())
    const expected = Error

    expect(actual).toBe(expected)
  })
  test('values can be assigned to null', () => {
    class App extends Model<App> {
      hello = fnx.string

      @fnx.action
      assignNull?() {
        this.hello = null
      }
    }

    const app = new App({ hello: 'hi' })

    app.assignNull()

    const actual = app.hello
    const expected = null

    expect(actual).toBe(expected)
  })
})
