import * as React from 'react'
import * as ReactTestUtils from 'react-addons-test-utils'
import ReactiveComponent from '../../src/extras/react'
import { action, createObservable, number } from '../../src/fnx'

describe('ReactiveComponent', () => {
  it('Should behave like a reaction', () => {
    class State {
      count = number
      increment? = action((state: State) => () => {
        state.count++
      })
    }

    const state = createObservable(State, { count: 0 })

    let runs = 0
    const Component = ReactiveComponent(() => {
      runs++
      return <div>{ state.count }</div>
    })

    ReactTestUtils.renderIntoDocument(<Component/>)

    state.increment()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should not call componentWillReact on initial render', () => {
    class State {
      count = number
      increment? = action((state: State) => () => {
        state.count++
      })
    }

    const state = createObservable(State, { count: 0 })

    let willReactRuns = 0
    class Component extends ReactiveComponent<{}, {}> {
      componentWillReact() {
        willReactRuns++
      }

      render() {
        return <div>{ state.count }</div>
      }
    }

    ReactTestUtils.renderIntoDocument(<Component/>)

    state.increment()
    state.increment()

    const actual = willReactRuns
    const expected = 2

    expect(actual).toBe(expected)
  })
})