import { action, boolean, complex, createObservable, parseInto, string } from '../../src/fnx'

describe('parseInto', () => {
    test('parseInto should work', () => {
    class State {
        str = string
        bool = boolean
        parse? = action((state: State) => (value: string) => {
        parseInto(value, state)
        })
    }

    const state = createObservable(State, { str: 'string', bool: false })

    const str = '{"str":"string2","bool":true}'

    state.parse(str)

    const actual = state.toString()
    const expected = str

    expect(actual).toBe(expected)
    })

    test('parseInto should work with complex types', () => {
    class State {
        str = string
        date = complex((d: Date) => d.toUTCString(), v => new Date(v))
        parse? = action((state: State) => (value: string) => {
        parseInto(value, state)
        })
    }

    const state = createObservable(State, { str: 'string', date: new Date(100) })

    const str = '{"str":"string2","date":"Thu, 01 Jan 1970 00:00:00 GMT"}'

    state.parse(str)

    const actual = state.toString()
    const expected = str

    expect(actual).toBe(expected)
    })
})
