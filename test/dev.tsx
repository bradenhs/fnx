import fnx from '../src/fnx'
// import { catchErrType } from './testHelpers'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('serialization', () => {
  it('toString should work', () => {
    class Sub extends fnx.Model<App> {
      hi = fnx.string
    }
    class App extends fnx.Model<App> {
      sub = fnx.object(Sub)
    }
    const app = new App({ sub: { hi: 'hello' } })

    const actual = app.toString()
    const expected = '{"sub":{"hi":"hello"}}'

    expect(actual).toBe(expected)
  })

  it('should be able to stringify arrays', () => {
    class App extends fnx.Model<App> {
      arr = fnx.arrayOf(fnx.string)
    }

    const app = new App({ arr: ['a', 'b']})

    const actual = app.toString()
    const expected = '{"arr":["a","b"]}'

    expect(actual).toBe(expected)
  })

  it('toString should work with complex types', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }
    const app = new App({ date: new Date(100) })

    const actual = app.toString()
    const expected = '{"date":"Thu, 01 Jan 1970 00:00:00 GMT"}'

    expect(actual).toBe(expected)
  })

  it('should parse string input', () => {
    class App extends fnx.Model<App> {
      hello = fnx.string
    }

    const app = new App({ hello: 'hi' })

    app.parse('{"hello":"there"}')

    const actual = app.hello
    const expected = 'there'

    expect(actual).toBe(expected)
  })

  it('should parse object input', () => {
    class App extends fnx.Model<App> {
      hello = fnx.string
    }

    const app = new App({ hello: 'there' })

    app.parse({ hello: 'hi' })

    const actual = app.hello
    const expected = 'hi'

    expect(actual).toBe(expected)
  })

  it('should parse object input with complex types', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex((d: Date)=> d.valueOf(), v => new Date(v))
    }

    const app = new App({ date: new Date() })

    app.parse({ date: new Date(1000) })

    const actual = app.date.valueOf()
    const expected = 1000

    expect(actual).toBe(expected)
  })

  it('should parse object input with complex types in serialized form', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex((d: Date)=> d.valueOf(), v => new Date(v))
    }

    const app = new App({ date: new Date() })

    app.parse({ date: 1000 })

    const actual = app.date.valueOf()
    const expected = 1000

    expect(actual).toBe(expected)
  })
})
