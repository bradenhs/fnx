import * as React from 'react'
import * as renderer from 'react-test-renderer'
import ReactiveComponent from '../src/extras/react'
import { action, createObservable, string } from '../src/fnx'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run dev`
 */

it('asdf', () => {
  class State {
    name = string
    changeName? = action((s: State) => (name: string) => {
      s.name = name
    })
  }

  const state = createObservable(State, { name: '' })

  let runs = 0

  const Component = ReactiveComponent(() => {
    runs++
    return <div/>
  })

  renderer.create(<Component/>)

  state.changeName('Bob')

  const actual = runs
  const expected = 2

  expect(actual).toBe(expected)
})
