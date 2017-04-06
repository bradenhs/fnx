import fnx from '../src/fnx'
import { catchErrType } from './testHelpers'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('serialization', () => {
  it('toString should work', () => {
    class App extends fnx.Model<App> {
      hello = fnx.string
    }
    const app = new App({ hello: 'hello' })

    const actual = app.toString()
    const expected = '{"hello":"hello"}'

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
  it('should create an object with toJS', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }
    const app = new App({ date: new Date(100) })
    const actual = app.toJS().date.valueOf()
    const expected = new Date(100).valueOf()

    expect(actual).toBe(expected)
  })
  it('should created an object with serialized complex values with toJS', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }
    const app = new App({ date: new Date(100) })
    const actual = app.toJS({ serializeComplex: true }).date
    const expected = 'Thu, 01 Jan 1970 00:00:00 GMT'

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

    app.parse({ date: 1000 }, { asJson: true })

    const actual = app.date.valueOf()
    const expected = 1000

    expect(actual).toBe(expected)
  })
})

describe('oneOf', () => {
  it('should let oneOf accept primitive value', () => {
    class App extends fnx.Model<App> {
      helloOrGoodbye = fnx.oneOf('hello', 'goodbye')
    }

    const app = new App({ helloOrGoodbye: 'hello' })

    const actual = app.helloOrGoodbye
    const expected = 'hello'

    expect(actual).toBe(expected)
  })
  it('should err with oneOf if not the expected value', () => {
    class App extends fnx.Model<App> {
      helloOrGoodbye = fnx.oneOf('hello', 'goodbye')
    }

    const actual = catchErrType(() => new App({ helloOrGoodbye: 'hi' }))
    const expected = Error

    expect(actual).toBe(expected)
  })
})
