import {
  action, arrayOf, complex, createObservable, mapOf, number, object, oneOf, optional,
  readonly, string, computed
} from '../../src/api'
import * as core from '../../src/core'
import { catchErrType } from '../testHelpers'

describe('createObservable', () => {
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

  it('should allow mapOf type', () => {
    class State {
      foo = mapOf(number)
    }

    const state = createObservable(State, { foo: { bar: 5 } })

    const actual = state
    const expected = { foo: { bar: 5 } }

    expect(actual).toEqual(expected)
  })

  it('should throw on mutating mapOf type', () => {
    class State {
      foo = mapOf(number)
    }

    const state = createObservable(State, { foo: { } })

    const actual = catchErrType(() => state.foo.asdf = 5 )
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutation of mapOf through an action', () => {
    class State {
      foo = mapOf(number)
      addFoo? = action((state: State) => (key, num: number) => {
        state.foo[key] = num
      })
    }

    const state = createObservable(State, { foo: { } })

    state.addFoo('hello', 5)

    const actual = state
    const expected = { foo: { hello: 5} }

    expect(actual).toEqual(expected)
  })

  it('should allow throw when trying to assign wrong type in mapOf', () => {
    class State {
      foo = mapOf(number)
      addFoo? = action((state: State) => (key, num: string) => {
        state.foo[key] = num as any
      })
    }

    const state = createObservable(State, { foo: { } })

    const actual = catchErrType(() => state.addFoo('hello', 'no'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow complex types', () => {
    class State {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
    }

    const state = createObservable(State, { date: new Date(1000) })

    const actual = state.date.toString()
    const expected = new Date(1000).toString()

    expect(actual).toEqual(expected)
  })

  it('should throw error when mutating complex type outside of an action', () => {
    class State {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
    }

    const state = createObservable(State, { date: new Date(0) })

    const actual = catchErrType(() => state.date.setMonth(4))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutating complex types in actions', () => {
    class State {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
      setYear? = action((s: State) => (year: number) => {
        s.date.setFullYear(year)
      })
    }

    const s = createObservable(State, { date: new Date(1000) })

    s.setYear(2000)

    const actual = s.date.getFullYear()
    const expected = 2000

    expect(actual).toBe(expected)
  })

  it('should throw when mutating readonly complex type in action', () => {
    class State {
      @readonly date = complex((d: Date) => d.toUTCString(), v => new Date(v))
      setYear? = action((s: State) => (year: number) => {
        s.date.setFullYear(year)
      })
    }

    const s = createObservable(State, { date: new Date(1000) })

    const actual = catchErrType(() => s.setYear(2000))
    const expected = Error

    expect(actual).toBe(expected)
  })

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

  it('should throw when misassigning oneOf', () => {
    class State {
      numOrString = oneOf(number, string)
      setBool? = action((state: State) => (bool: boolean) => {
        state.numOrString = bool as any
      })
    }

    const state = createObservable(State, { numOrString: '' })

    const actual = catchErrType(() => state.setBool(false))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow computed properties', () => {
    class State {
      firstName = string
      lastName = string

      fullName? = computed((state: State) => state.firstName + ' ' + state.lastName)
    }

    const state = createObservable(State, { firstName: 'Foo', lastName: 'Bar' })

    const actual = state.fullName
    const expected = 'Foo Bar'

    expect(actual).toBe(expected)
  })

  it('should throw when trying to mutate computed', () => {
    class State {
      comp? = computed(() => 0)
      mutateComputed? = action((state: State) => () => {
        state.comp = 5
      })
    }

    const state = createObservable(State, {})

    const actual = catchErrType(() => state.mutateComputed())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should only recompute when stale', () => {
    let runs = 0

    class State {
      firstName = string
      lastName = string

      fullName? = computed((state: State) => {
        runs++
        return state.firstName + ' ' + state.lastName
      })
    }

    const state = createObservable(State, { firstName: 'Foo', lastName: 'Bar' })

    state.fullName
    state.fullName

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should mark as stale without rerunning', () => {
    let runs = 0

    class State {
      firstName = string
      lastName = string

      fullName? = computed((state: State) => {
        runs++
        return state.firstName + ' ' + state.lastName
      })

      changeName? = action((state: State) => (firstName: string, lastName: string) => {
        state.firstName = firstName
        state.lastName = lastName
      })
    }

    const state = createObservable(State, { firstName: 'Foo', lastName: 'Bar' })

    state.fullName
    state.changeName('Foo2', 'Bar2')

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should recompute when marked as stale', () => {
    let runs = 0

    class State {
      firstName = string
      lastName = string

      fullName? = computed((state: State) => {
        runs++
        return state.firstName + ' ' + state.lastName
      })

      changeName? = action((state: State) => (firstName: string, lastName: string) => {
        state.firstName = firstName
        state.lastName = lastName
      })
    }

    const state = createObservable(State, { firstName: 'Foo', lastName: 'Bar' })

    state.fullName
    state.changeName('Foo2', 'Bar2')
    state.fullName

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should allowed nested computed props 1', () => {
    class Person {
      @readonly id = number
      firstName = string
      lastName = string

      fullName? = computed((person: Person) => {
        return person.firstName + ' ' + person.lastName
      })

      changeName? = action((person: Person) => (firstName: string, lastName: string) => {
        person.firstName = firstName
        person.lastName = lastName
      })
    }

    class State {
      people = mapOf(object(Person))
      sortedPeople? = computed((state: State) => {
        return Object.keys(state.people).map(k => state.people[k]).sort((a: Person, b: Person) => {
          return a.fullName.localeCompare(b.fullName)
        })
      })

      addPerson? = action((state: State) => (person: Person) => {
        state.people[person.id] = person
      })
    }

    const state = createObservable(State, { people: {} })

    state.addPerson({
      id: 1,
      firstName: 'B',
      lastName: 'B'
    })

    state.addPerson({
      id: 2,
      firstName: 'C',
      lastName: 'C'
    })

    const actual = state.sortedPeople
    const expected = [
      { id: 1, firstName: 'B', lastName: 'B' },
      { id: 2, firstName: 'C', lastName: 'C' }
    ]

    expect(actual).toEqual(expected)
  })

  it('should allowed nested computed props 2', () => {
    class Person {
      @readonly id = number
      firstName = string
      lastName = string

      fullName? = computed((person: Person) => {
        return person.firstName + ' ' + person.lastName
      })

      changeName? = action((person: Person) => (firstName: string, lastName: string) => {
        person.firstName = firstName
        person.lastName = lastName
      })
    }

    class State {
      people = mapOf(object(Person))
      sortedPeople? = computed((state: State) => {
        return Object.keys(state.people).map(k => state.people[k]).sort((a: Person, b: Person) => {
          return a.fullName.localeCompare(b.fullName)
        })
      })

      addPerson? = action((state: State) => (person: Person) => {
        state.people[person.id] = person
      })
    }

    const state = createObservable(State, { people: {} })

    state.addPerson({
      id: 1,
      firstName: 'B',
      lastName: 'B'
    })

    state.addPerson({
      id: 2,
      firstName: 'C',
      lastName: 'C'
    })

    state.people[2].changeName('A', 'A')

    const actual = state.sortedPeople
    const expected = [
      { id: 2, firstName: 'A', lastName: 'A' },
      { id: 1, firstName: 'B', lastName: 'B' }
    ]

    expect(actual).toEqual(expected)
  })

  it('should stop tracking values not passed over in last computation', () => {
    let runs = 0

    class State {
      @optional num? = number
      letter = string
      comp? = computed((state: State) => {
        runs++
        if (state.num != undefined) {
          return state.num
        } else {
          return state.letter
        }
      })
      setNum? = action((state: State) => () => {
        state.num = 1
      })
      setLetter? = action((state: State) => () => {
        state.letter = 'B'
      })
    }

    const state = createObservable(State, { letter: 'A' })

    state.comp
    state.setNum()
    state.comp
    state.setLetter()
    state.comp

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })
})
