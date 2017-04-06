import { Model, number, object } from '../src/fnx'
import { catchErrType } from './testHelpers'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('test', () => {
  it('should enforce descriptions be extended from Model', () => {
    class Hi { }

    class App extends Model<App> {
      hi = object(Hi)
    }

    const initialAppState: App = {
      hi: { }
    }

    const actual = catchErrType(() => new App(initialAppState))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should initialize state properly', () => {
    class Hi extends Model<App> {
      count = number
    }

    class Hello extends Model<App> {
      hello = number
    }

    class App extends Hello {
      hi = object(Hi)
    }

    const initialAppState: App = {
      hello: 3,
      hi: {
        count: 2
      }
    }

    const app = new App(initialAppState)

    console.log(app)

    const actual = app.toString()
    const expected = '{"hello":3,"hi":{"count":2}}'

    expect(actual).toBe(expected)
  })
})
