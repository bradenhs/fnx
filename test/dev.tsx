import fnx, { Model } from '../src/fnx'
// import { catchErrType } from './testHelpers'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('diff', () => {
  it('should do stuff', () => {
    class App extends Model<App> {
      date = fnx.complex.date

      @fnx.action
      nextYear?() {
        this.date.setFullYear(this.date.getFullYear() + 1)
      }
    }

    const app = new App({ date: new Date(0) })

    const year = app.date.getFullYear()

    app.nextYear()
    app.nextYear()

    const actual = app.date.getFullYear()
    const expected = year + 2

    expect(actual).toBe(expected)
  })
})
