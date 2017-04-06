import { action, boolean, complex, Model, parseInto, string } from '../../src/fnx'

describe('parseInto', () => {
  test('parseInto should work', () => {
    class State extends Model<State> {
      str = string
      bool = boolean

      @action parse?(value: string) {
        parseInto(value, this)
      }
    }

    const state = new State({ str: 'string', bool: false })

    const str = '{"str":"string2","bool":true}'

    state.parse(str)

    const actual = state.toString()
    const expected = str

    expect(actual).toBe(expected)
  })

  test('parseInto should work with complex types', () => {
    class State extends Model<State> {
      str = string
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))

      @action parse?(value: string) {
        parseInto(value, this)
      }
    }

    const state = new State({ str: 'string', date: new Date(100) })

    const str = '{"str":"string2","date":"Thu, 01 Jan 1970 00:00:00 GMT"}'

    state.parse(str)

    const actual = state.toString()
    const expected = str

    expect(actual).toBe(expected)
  })
})
