import { action, createObservable, mapOf, number, reaction, string } from '../../src/fnx'

describe('reaction', () => {
  it('should trigger the reaction', () => {
    class State {
      foo = string
      changeFoo? = action((state: State) => (foo: string) => {
        state.foo = foo
      })
    }

    let reactionRuns = 0

    const state = createObservable(State, { foo: 'Foo' })

    reaction(() => {
      reactionRuns++
      state.foo
    })

    state.changeFoo('Foo2')

    const actual = reactionRuns
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should only use last accessed properties when determining whether to run a reaction', () => {
    class State {
      foo = string
      bar = string
      changeFoo? = action((state: State) => (foo: string) => {
        state.foo = foo
      })
      changeBar? = action((state: State) => (bar: string) => {
        state.bar = bar
      })
    }

    let reactionRuns = 0

    const state = createObservable(State, { foo: 'Foo', bar: 'Bar' })

    reaction(() => {
      reactionRuns++
      if (state.foo === 'Foo2') {
        state.foo
      } else {
        state.bar
      }
    })

    state.changeBar('Bar2')
    state.changeFoo('Foo2')
    state.changeBar('Bar')

    const actual = reactionRuns
    const expected = 3

    expect(actual).toBe(expected)
  })

  it('should not allow actions to be triggered within reactions', () => {
    class State {
      foo = string
      changeFoo? = action((state: State) => (foo: string) => {
        state.foo = foo
      })
    }

    const state = createObservable(State, { foo: 'Foo' })

    let didError = false

    reaction(() => {
      try {
        state.foo
        state.changeFoo('foo2')
      } catch (e) {
        didError = true
      }
    })

    const actual = didError
    const expected = true

    expect(actual).toBe(expected)
  })

  it('should trigger reaction on map when property is added', () => {
    class State {
      nums = mapOf(number)
      addNum? = action((state: State) => (key: string, value: number) => {
        state.nums[key] = value
      })
    }

    const state = createObservable(State, { nums: {} })

    let reactionRuns = 0

    reaction(() => {
      reactionRuns++
      state.nums
    })

    state.addNum('hi', 5)

    const actual = reactionRuns
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should properly dispose of the reaction', () => {
    class State {
      num = number
      setNum? = action((state: State) => (value: number) => {
        state.num = value
      })
    }

    const state = createObservable(State, { num: 0 })

    let reactionRuns = 0

    const myReaction = reaction(() => {
      reactionRuns++
      state.num
    })

    myReaction.dispose()

    state.setNum(1)

    const actual = reactionRuns
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should trigger reaction when property is added to mapOf', () => {
    class State {
      m = mapOf(number)
      add? = action((state: State) => () => {
        state.m.hi = 2
      })
    }

    const state = createObservable(State, { m: { }})

    let runs = 0

    reaction(() => {
      runs++
      state.m
    })

    state.add()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should trigger reaction when property is deleted from mapOf', () => {
    class State {
      m = mapOf(number)
      remove? = action((state: State) => () => {
        delete state.m.hi
      })
    }

    const state = createObservable(State, { m: { hi: 2 }})

    let runs = 0

    reaction(() => {
      runs++
      state.m
    })

    state.remove()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })
})
