import { action, computed, mapOf, Model, number, reaction, string } from '../../src/fnx'

describe('reaction', () => {
  it('should trigger the reaction', () => {
    class State extends Model<State> {
      foo = string

      @action changeFoo?(foo: string) {
        this.foo = foo
      }
    }

    let reactionRuns = 0

    const state = new State({ foo: 'Foo' })

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
    class State extends Model<State> {
      foo = string
      bar = string
      @action changeFoo?(foo: string) {
        this.foo = foo
      }
      @action changeBar?(bar: string) {
        this.bar = bar
      }
    }

    let reactionRuns = 0

    const state = new State({ foo: 'Foo', bar: 'Bar' })

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
    class State extends Model<State> {
      foo = string
      @action changeFoo?(foo: string) {
        this.foo = foo
      }
    }

    const state = new State({ foo: 'Foo' })

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
    class State extends Model<State> {
      nums = mapOf(number)
      @action addNum?(key: string, value: number) {
        this.nums[key] = value
      }
    }

    const state = new State({ nums: {} })

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
    class State extends Model<State> {
      num = number
      @action setNum?(value: number) {
        this.num = value
      }
    }

    const state = new State({ num: 0 })

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
    class State extends Model<State> {
      m = mapOf(number)
      @action add?() {
        this.m.hi = 2
      }
    }

    const state = new State({ m: { }})

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
    class State extends Model<State> {
      m = mapOf(number)
      @action remove?() {
        delete this.m.hi
      }
    }

    const state = new State({ m: { hi: 2 }})

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

  it('should track computed values after stale', () => {
    class State extends Model<State> {
      count = number
      @computed countPlusOne?() {
        return this.count + 1
      }
      @action increment?() {
        this.count++
      }
    }

    const initialState: State = {
      count: 0
    }

    const state = new State(initialState)

    let runs = 0

    state.countPlusOne()

    reaction(() => {
      runs++
      state.countPlusOne()
    })

    state.increment()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('computed values should track computed values after stale', () => {
    class State extends Model<State> {
      count = number
      @computed countPlusOne?() {
        return this.count + 1
      }
      @computed countPlusTwo?() {
        return this.countPlusOne() + 1
      }
      @action increment?() {
        this.count++
      }
    }

    const initialState: State = {
      count: 0
    }

    const state = new State(initialState)

    let runs = 0

    state.countPlusOne()
    state.countPlusTwo()

    reaction(() => {
      runs++
      state.countPlusTwo()
    })

    state.increment()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })
})
