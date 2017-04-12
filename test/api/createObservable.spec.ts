import {
  action, arrayOf, complex, computed, mapOf, Model, number, object, oneOf,
  optional, readonly, string
} from '../../src/api'
import * as core from '../../src/core'
import { catchErrType } from '../testHelpers'

describe('createObservable', () => {
  it('creates an observable with a number as a property', () => {
    class State extends Model<State> {
      num = number
    }

    const state = new State({ num: 4 })

    const actual = state.num
    const expected = 4

    expect(actual).toBe(expected)
  })

  it('throws when mutating state outside of an action', () => {
    class State extends Model<{}> {
      count = number
    }

    const state = new State({ count: 0 })

    const actual = catchErrType(() => state.count = state.count + 1)
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('allows properties to be mutated through actions', () => {
    class State extends Model<State> {
      count = number
      @action increment?() {
        this.count++
      }
    }

    const state = new State({ count: 0 })

    state.increment()

    const actual = state.count
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('throws if trying to redefine an action', () => {
    class State extends Model<State> {
      count = number
      @action increment?() {
        this.count++
      }
    }

    const actual = catchErrType(() => new State({ count: 0, increment: () => 0 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if there are extraneous properties on the object', () => {
    class State extends Model<State> {
      count = number
    }

    const actual = catchErrType(() => new (State as any)({ count: 0, hello: 1 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if trying to mutate a readonly property', () => {
    class State extends Model<State> {
      @readonly count = number
      @action increment?() {
        this.count++
      }
    }

    const actual = catchErrType(() => new State({ count: 0 }).increment())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('throws if trying missing props on object', () => {
    class State extends Model<State> {
      count = number
    }

    const actual = catchErrType(() => new (State as any)({ }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('allows optional props to be missing', () => {
    class State extends Model<State> {
      @optional count? = number
    }

    const initialState: State = { }

    const state = new State(initialState)

    const actual = state.count
    const expected = undefined

    expect(actual).toBe(expected)
  })

  it('allows nested objects at create time', () => {
    class Person extends Model<State> {
      firstName = string
    }

    class State extends Model<State> {
      person = object(Person)
    }

    const initialState: State = {
      person: {
        firstName: 'Foo'
      }
    }

    const state = new State(initialState)

    const actual = state.person.firstName
    const expected = 'Foo'

    expect(actual).toBe(expected)
  })

  it('allows properties not on the description to be accessed', () => {
    class State extends Model<State> {
      firstName = string
    }

    const state = new State({ firstName: 'Foo' } )

    const actual = state['asdfasdf'] // tslint:disable-line
    const expected = undefined

    expect(actual).toEqual(expected)
  })

  it('allows nested objects to be set in an action', () => {
    class Person extends Model<State> {
      firstName = string
    }

    class State extends Model<State> {
      @optional person? = object(Person)
      @action setPerson?(person: Person) {
        this.person = person
      }
    }

    const initialState: State = { }

    const state = new State(initialState)

    state.setPerson({ firstName: 'Foo' })

    const actual = { person: { firstName: 'Foo' } }
    const expected = state

    expect(actual).toEqual(expected)
  })

  it('should error if trying to set a string as a number in object creation', () => {
    class State extends Model<State> {
      foo = string
    }

    const actual = catchErrType(() => new (State as any)({ foo: 5 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should error if trying to set a string as a number in an action', () => {
    class State extends Model<State> {
      str = string
      @action setAsNum?() {
        this.str = 0 as any
      }
    }

    const initialState: State = {
      str: ''
    }

    const state = new State(initialState)

    const actual = catchErrType(() => state.setAsNum())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should create observables out of nested objects', () => {
    class Person extends Model<State> {
      firstName = string
    }
    class State extends Model<State> {
      person = object(Person)
    }
    const initialState: State = {
      person: { firstName: '' }
    }
    const state = new State(initialState)

    const actual = core.isObservable(state.person)
    const expected = true

    expect(actual).toBe(expected)
  })

  it('should allow arrays', () => {
    class State extends Model<State> {
      foo = arrayOf(string)
    }

    const state = new State({ foo: [ 'one', 'two' ] } )

    const actual = state.foo
    const expected = [ 'one', 'two' ]

    expect(actual).toEqual(expected)
  })

  it('should throw error when mutating array out of action', () => {
    class State extends Model<State> {
      foo = arrayOf(number)
    }

    const state = new State({ foo: [ ] })

    const actual = catchErrType(() => state.foo.push(5))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutation of arrays through actions', () => {
    class State extends Model<State> {
      foo = arrayOf(string)
      @action addFoo?() {
        this.foo.push('item')
      }
    }

    const state = new State({ foo: [ ]})

    state.addFoo()

    const actual = state
    const expected = { foo: [ 'item'] }

    expect(actual).toEqual(expected)
  })

  it('should update length property on array update', () => {
    class State extends Model<State> {
      foo = arrayOf(string)
      @action addFoo?() {
        this.foo.push('item')
      }
    }

    const state = new State({ foo: [ ]})

    state.addFoo()

    const actual = state.foo.length
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should allow mapOf type', () => {
    class State extends Model<State> {
      foo = mapOf(number)
    }

    const state = new State({ foo: { bar: 5 } })

    const actual = state
    const expected = { foo: { bar: 5 } }

    expect(actual).toEqual(expected)
  })

  it('should throw on mutating mapOf type', () => {
    class State extends Model<State> {
      foo = mapOf(number)
    }

    const state = new State({ foo: { } })

    const actual = catchErrType(() => state.foo.asdf = 5 )
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutation of mapOf through an action', () => {
    class State extends Model<State> {
      foo = mapOf(number)
      @action addFoo?(key, num: number) {
        this.foo[key] = num
      }
    }

    const state = new State({ foo: { } })

    state.addFoo('hello', 5)

    const actual = state
    const expected = { foo: { hello: 5} }

    expect(actual).toEqual(expected)
  })

  it('should allow throw when trying to assign wrong type in mapOf', () => {
    class State extends Model<State> {
      foo = mapOf(number)
      @action addFoo?(key, num: string) {
        this.foo[key] = num as any
      }
    }

    const state = new State({ foo: { } })

    const actual = catchErrType(() => state.addFoo('hello', 'no'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow complex types', () => {
    class State extends Model<State> {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
    }

    const state = new State({ date: new Date(1000) })

    const actual = state.date.toString()
    const expected = new Date(1000).toString()

    expect(actual).toEqual(expected)
  })

  it('should throw error when mutating complex type outside of an action', () => {
    class State extends Model<State> {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
    }

    const state = new State({ date: new Date(0) })

    const actual = catchErrType(() => state.date.setMonth(4))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutating complex types in actions', () => {
    class State extends Model<State> {
      date = complex((d: Date) => d.toUTCString(), v => new Date(v))
      @action setYear?(year: number) {
        this.date.setFullYear(year)
      }
    }

    const s = new State({ date: new Date(1000) })

    s.setYear(2000)

    const actual = s.date.getFullYear()
    const expected = 2000

    expect(actual).toBe(expected)
  })

  it('should throw when mutating readonly complex type in action', () => {
    class State extends Model<State> {
      @readonly date = complex((d: Date) => d.toUTCString(), v => new Date(v))
      @action setYear?(year: number) {
        this.date.setFullYear(year)
      }
    }

    const s = new State({ date: new Date(1000) })

    const actual = catchErrType(() => s.setYear(2000))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow oneOf', () => {
    class State extends Model<State> {
      numOrString = oneOf(number, string)
      @action setNum?(num: number) {
        this.numOrString = num
      }
      @action setString?(str: string) {
        this.numOrString = str
      }
    }

    const state = new State({ numOrString: '' })

    state.setNum(4)
    state.setString('hi')

    const actual = state.numOrString
    const expected = 'hi'

    expect(actual).toBe(expected)
  })

  it('should throw when misassigning oneOf', () => {
    class State extends Model<State> {
      numOrString = oneOf(number, string)
      @action setBool?(bool: boolean) {
        this.numOrString = bool as any
      }
    }

    const state = new State({ numOrString: '' })

    const actual = catchErrType(() => state.setBool(false))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow computed properties', () => {
    class State extends Model<State> {
      firstName = string
      lastName = string

      @computed fullName?() {
        return this.firstName + ' ' + this.lastName
      }
    }

    const state = new State({ firstName: 'Foo', lastName: 'Bar' })

    const actual = state.fullName()
    const expected = 'Foo Bar'

    expect(actual).toBe(expected)
  })

  it('should throw when trying to mutate computed', () => {
    class State extends Model<State> {
      @computed comp?() {
        return 0
      }
      @action mutateComputed?() {
        (this as any).comp = 5
      }
    }

    const state = new State({})

    const actual = catchErrType(() => state.mutateComputed())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should only recompute when stale', () => {
    let runs = 0

    class State extends Model<State> {
      firstName = string
      lastName = string

      @computed fullName?() {
        runs++
        return this.firstName + ' ' + this.lastName
      }
    }

    const state = new State({ firstName: 'Foo', lastName: 'Bar' })

    state.fullName()
    state.fullName()

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should mark as stale without rerunning', () => {
    let runs = 0

    class State extends Model<State> {
      firstName = string
      lastName = string

      @computed fullName?() {
        runs++
        return this.firstName + ' ' + this.lastName
      }

      @action changeName?(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
      }
    }

    const state = new State({ firstName: 'Foo', lastName: 'Bar' })

    state.fullName()
    state.changeName('Foo2', 'Bar2')

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  it('should recompute when marked as stale', () => {
    let runs = 0

    class State extends Model<State> {
      firstName = string
      lastName = string

      @computed fullName?() {
        runs++
        return this.firstName + ' ' + this.lastName
      }

      @action changeName?(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
      }
    }

    const state = new State({ firstName: 'Foo', lastName: 'Bar' })

    state.fullName()
    state.changeName('Foo2', 'Bar2')
    state.fullName()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should allowed nested computed props 1', () => {
    class Person extends Model<State> {
      @readonly id = number
      firstName = string
      lastName = string

      @computed fullName?() {
        return this.firstName + ' ' + this.lastName
      }

      @action changeName?(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
      }
    }

    class State extends Model<State> {
      people = mapOf(object(Person))
      @computed sortedPeople?() {
        return Object.keys(this.people).map(k => this.people[k]).sort((a: Person, b: Person) => {
          return a.fullName().localeCompare(b.fullName())
        })
      }

      @action addPerson?(person: Person) {
        this.people[person.id] = person
      }
    }

    const state = new State({ people: {} })

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

    const actual = state.sortedPeople()
    const expected = [
      { id: 1, firstName: 'B', lastName: 'B' },
      { id: 2, firstName: 'C', lastName: 'C' }
    ]

    expect(actual).toEqual(expected)
  })

  it('should allowed nested computed props 2', () => {
    class Person extends Model<State> {
      @readonly id = number
      firstName = string
      lastName = string

      @computed fullName?() {
        return this.firstName + ' ' + this.lastName
      }

      @action changeName?(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
      }
    }

    class State extends Model<State> {
      people = mapOf(object(Person))
      @computed sortedPeople?() {
        return Object.keys(this.people).map(k => this.people[k]).sort((a: Person, b: Person) => {
          return a.fullName().localeCompare(b.fullName())
        })
      }

      @action addPerson?(person: Person) {
        this.people[person.id] = person
      }
    }

    const state = new State({ people: {} })

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

    const actual = state.sortedPeople()
    const expected = [
      { id: 2, firstName: 'A', lastName: 'A' },
      { id: 1, firstName: 'B', lastName: 'B' }
    ]

    expect(actual).toEqual(expected)
  })

  it('should stop tracking values not passed over in last computation', () => {
    let runs = 0

    class State extends Model<State> {
      @optional num? = number
      letter = string
      @computed comp?() {
        runs++
        if (this.num != null) {
          return this.num
        } else {
          return this.letter
        }
      }
      @action setNum?() {
        this.num = 1
      }
      @action setLetter?() {
        this.letter = 'B'
      }
    }

    const state = new State({ letter: 'A' })

    state.comp()
    state.setNum()
    state.comp()
    state.setLetter()
    state.comp()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should enforce descriptions be extended from Model', () => {
    class Hi { }

    class App extends Model<App> {
      hi = object(Hi)
    }

    const initialAppState: App = {
      hi: { }
    }

    const actual = catchErrType(() => new App(initialAppState))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should initialize state properly', () => {
    class Hi extends Model<App> {
      count = number
    }

    class Hello extends Model<App> {
      hello = number
    }

    class App extends Hello {
      hi = object(Hi)
    }

    const initialAppState: App = {
      hello: 3,
      hi: {
        count: 2
      }
    }

    const app = new App(initialAppState)

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"hello":3,"hi":{"count":2}}'

    expect(actual).toBe(expected)
  })
})
