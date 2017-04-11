import fnx from '../../src/fnx'

describe('serialization', () => {
  it('toString should work', () => {
    class Sub extends fnx.Model<App> {
      hi = fnx.string
    }
    class App extends fnx.Model<App> {
      sub = fnx.object(Sub)
    }
    const app = new App({ sub: { hi: 'hello' } })

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"sub":{"hi":"hello"}}'

    expect(actual).toBe(expected)
  })

  it('should be able to stringify arrays', () => {
    class App extends fnx.Model<App> {
      arr = fnx.arrayOf(fnx.string)
    }

    const app = new App({ arr: ['a', 'b']})

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"arr":["a","b"]}'

    expect(actual).toBe(expected)
  })

  it('toString should work with complex types', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }
    const app = new App({ date: new Date(100) })

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"date":"Thu, 01 Jan 1970 00:00:00 GMT"}'

    expect(actual).toBe(expected)
  })

  it('should parse string input', () => {
    class App extends fnx.Model<App> {
      hello = fnx.string
    }

    const app = new App({ hello: 'hi' })

    app.applySnapshot('{"hello":"there"}')

    const actual = app.hello
    const expected = 'there'

    expect(actual).toBe(expected)
  })

  it('should parse object input', () => {
    class App extends fnx.Model<App> {
      hello = fnx.string
    }

    const app = new App({ hello: 'there' })

    app.applySnapshot({ hello: 'hi' })

    const actual = app.hello
    const expected = 'hi'

    expect(actual).toBe(expected)
  })

  it('should parse object input with complex types', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }

    const app = new App({ date: new Date() })

    app.applySnapshot({ date: new Date(1000) })

    const actual = app.date.valueOf()
    const expected = 1000

    expect(actual).toBe(expected)
  })

  it('should parse object input with complex types in serialized form', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }

    const app = new App({ date: new Date() })

    app.applySnapshot({ date: 'Thu, 01 Jan 1970 00:00:05 GMT' }, { asJSON: true })

    const actual = app.date.valueOf()
    const expected = 5000

    expect(actual).toBe(expected)
  })

  it('should parse object input with complex types in serialized form', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }

    const app = new App({ date: new Date() })

    app.applySnapshot({ date: new Date(5000) })

    const actual = app.date.valueOf()
    const expected = 5000

    expect(actual).toBe(expected)
  })

  it('should produce valid getSnapshot output', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }

    const app = new App({ date: new Date(40000) })

    const actual = app.getSnapshot().date.valueOf()
    const expected = 40000

    expect(actual).toBe(expected)
  })

  it('should produce valid getSnapshot asJSON output', () => {
    class App extends fnx.Model<App> {
      date = fnx.complex.date
    }

    const app = new App({ date: new Date(2000) })

    const actual = app.getSnapshot({ asJSON: true }).date
    const expected = 'Thu, 01 Jan 1970 00:00:02 GMT'

    expect(actual).toBe(expected)
  })
})
