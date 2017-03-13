import {
  action, arrayOf, createObservable, number, object, optional, readonly, string
} from '../../src/api'
import * as core from '../../src/core'
import { catchErrType } from '../testHelpers'

describe('playground', () => {
  it('creates an observable with a number as a property', () => {
    class State {
      num = number
    }

    const state = createObservable(State, { num: 4 })

    const actual = state.num
    const expected = 4

    expect(actual).toBe(expected)
  })

  it('throws when mutating state outside of an action', () => {
    class State {
      count = number
    }

    const state = createObservable(State, { count: 0 })

    const actual = catchErrType(() => state.count = state.count + 1)
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('allows properties to be mutated through actions', () => {
    class State {
      count = number
      increment? = action((state: State) => () => {
        state.count++
      })
    }

    const state = createObservable(State, { count: 0 })

    state.increment()

    const actual = state.count
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('throws if trying to redefine an action', () => {
    class State {
      count = number
      increment? = action((state: State) => () => {
        state.count++
      })
    }

    const actual = catchErrType(() => createObservable(State, { count: 0, increment: () => 0 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if there are extraneous properties on the object', () => {
    class State {
      count = number
    }

    const actual = catchErrType(() => (createObservable as any)(State, { count: 0, hello: 1 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if trying to mutate a readonly property', () => {
    class State {
      @readonly count = number
      increment? = action((state: State) => () => {
        state.count++
      })
    }

    const actual = catchErrType(() => createObservable(State, { count: 0 }).increment())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if trying missing props on object', () => {
    class State {
      count = number
    }

    const actual = catchErrType(() => createObservable(State, { }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('allows optional props to be missing', () => {
    class State {
      @optional count? = number
    }

    const initialState: State = { }

    const state = createObservable(State, initialState)

    const actual = state.count
    const expected = undefined

    expect(actual).toBe(expected)
  })

  it('allows nested objects at create time', () => {
    class Person {
      firstName = string
    }

    class State {
      person = object(Person)
    }

    const initialState: State = {
      person: {
        firstName: 'Foo'
      }
    }

    const state = createObservable(State, initialState)

    const actual = state.person.firstName
    const expected = 'Foo'

    expect(actual).toBe(expected)
  })

  it('allows properties not on the description to be accessed', () => {
    class State {
      firstName = string
    }

    const state = createObservable(State, { firstName: 'Foo' } )

    const actual = state['asdfasdf'] // tslint:disable-line
    const expected = undefined

    expect(actual).toEqual(expected)
  })

  it('allows nested objects to be set in an action', () => {
    class Person {
      firstName = string
    }

    class State {
      @optional person? = object(Person)
      setPerson? = action((state: State) => (person: Person) => {
        state.person = person
      })
    }

    const initialState: State = { }

    const state = createObservable(State, initialState)

    state.setPerson({ firstName: 'Foo' })

    const actual = { person: { firstName: 'Foo' } }
    const expected = state

    expect(actual).toEqual(expected)
  })

  it('should error if trying to set a string as a number in object creation', () => {
    class State {
      foo = string
    }

    const actual = catchErrType(() => (createObservable as any)(State, { foo: 5 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should error if trying to set a string as a number in an action', () => {
    class State {
      str = string
      setAsNum? = action(state => () => {
        state.str = 0
      })
    }

    const initialState: State = {
      str: ''
    }

    const state = createObservable(State, initialState)

    const actual = catchErrType(() => state.setAsNum())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should create observables out of nested objects', () => {
    class Person {
      firstName = string
    }
    class State {
      person = object(Person)
    }
    const initialState: State = {
      person: { firstName: '' }
    }
    const state = createObservable(State, initialState)

    const actual = core.isObservable(state.person)
    const expected = true

    expect(actual).toBe(expected)
  })

  it('should allow arrays', () => {
    class State {
      foo = arrayOf(string)
    }

    const state = createObservable(State, { foo: [ 'one', 'two' ] } )

    const actual = state.foo
    const expected = [ 'one', 'two' ]

    expect(actual).toEqual(expected)
  })

  it('should throw error when mutating array out of action', () => {
    class State {
      foo = arrayOf(number)
    }

    const state = createObservable(State, { foo: [ ] })

    const actual = catchErrType(() => state.foo.push(5))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutation of arrays through actions', () => {
    class State {
      foo = arrayOf(string)
      addFoo? = action((state: State) => () => {
        state.foo.push('item')
      })
    }

    const state = createObservable(State, { foo: [ ]})

    state.addFoo()

    const actual = state
    const expected = { foo: [ 'item'] }

    expect(actual).toEqual(expected)
  })

  it('should update length property on array update', () => {
    class State {
      foo = arrayOf(string)
      addFoo? = action((state: State) => () => {
        state.foo.push('item')
      })
    }

    const state = createObservable(State, { foo: [ ]})

    state.addFoo()

    const actual = state.foo.length
    const expected = 1

    expect(actual).toBe(expected)
  })

})
