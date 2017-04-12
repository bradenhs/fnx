import {
  boolean, complex, mapOf, Model, number, object, string
} from '../../src/fnx'

describe('toString', () => {
  test('toString should work', () => {
    class Example extends Model<State> {
      foo = string
    }

    class State extends Model<State> {
      str = string
      bool = boolean
      num = number
      obj = object(Example)
      mp = mapOf(string)
    }

    const state = new State({
      str: 'hi', bool: false, num: 0, obj: { foo: 'foo' }, mp: { }
    })

    const actual = state.getSnapshot({ asString: true })
    const expected = '{"str":"hi","bool":false,"num":0,"obj":{"foo":"foo"},"mp":{}}'

    expect(actual).toBe(expected)
  })

  test('toString should work with complex types', () => {
    class Example extends Model<State> {
      foo = complex((d: Date) => ({ date: d.toUTCString() }), v => new Date(v.date))
    }

    class State extends Model<State> {
      str = string
      bool = boolean
      num = number
      obj = object(Example)
      mp = mapOf(string)
    }

    const state = new State({
      str: 'hi', bool: false, num: 0, obj: { foo: new Date(100) }, mp: { }
    })

    const actual = state.getSnapshot({ asString: true })
    const expected =
      '{"str":"hi","bool":false,"num":0,"obj":{"foo":' +
      '{"date":"Thu, 01 Jan 1970 00:00:00 GMT"}},"mp":{}}'

    expect(actual).toBe(expected)
  })
})
