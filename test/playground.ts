import { action, createObservable, number, oneOf, string } from '../src/fnx'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run playground` or `yarn run p`
 */

describe('playground', () => {
  it('should allow oneOf', () => {
    class State {
      numOrString = oneOf(number, string)
      setNum? = action((state: State) => (num: number) => {
        state.numOrString = num
      })
      setString? = action((state: State) => (str: string) => {
        state.numOrString = str
      })
    }

    const state = createObservable(State, { numOrString: '' })

    state.setNum(4)
    state.setString('hi')

    const actual = state.numOrString
    const expected = 'hi'

    expect(actual).toBe(expected)
  })
})
