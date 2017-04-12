import * as React from 'react'
import * as ReactTestUtils from 'react-addons-test-utils'
import ReactiveComponent from '../../src/extras/react'
import { action, Model, number } from '../../src/fnx'
import { sleep } from '../testHelpers'

describe('ReactiveComponent', () => {
  it('Should behave like a reaction', () => {
    class State extends Model<State> {
      count = number

      @action
      increment?() {
        this.count++
      }
    }

    const state = new State({ count: 0 })

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

  it('should dispose of the component\'s reaction after it dismounts', async () => {
    class App extends Model<App> {
      count = number

      @action increment?() {
        this.count++
      }
    }

    const app = new App({ count: -3 })

    let runs = 0

    const Negative = ReactiveComponent(() => {
      runs++
      return <div>{ app.count }</div>
    })

    const Container = ReactiveComponent(() => {
      return app.count < 0 ? <Negative/> : <div>{ app.count }</div>
    })

    ReactTestUtils.renderIntoDocument(<Container/>)

    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()

    const actual = runs
    const expected = 3

    expect(actual).toBe(expected)
  })

  it('should call componentWillUnmount still', async () => {
    class App extends Model<App> {
      count = number

      @action increment?() {
        this.count++
      }
    }

    const app = new App({ count: -3 })

    let runs = 0

    class Negative extends ReactiveComponent<{}, {}> {
      render() {
        return <div>{ app.count }</div>
      }

      componentWillUnmount() {
        runs++
      }
    }

    const Container = ReactiveComponent(() => {
      return app.count < 0 ? <Negative/> : <div>{ app.count }</div>
    })

    ReactTestUtils.renderIntoDocument(<Container/>)

    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()
    await sleep(1)
    app.increment()

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should not call componentWillReact on initial render', () => {
    class State extends Model<State> {
      count = number

      @action
      increment?() {
        this.count++
      }
    }

    const state = new State({ count: 0 })

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
