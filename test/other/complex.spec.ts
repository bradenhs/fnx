import fnx, { Model } from '../../src/fnx'
import { catchErrType } from '../testHelpers'

describe('complex', () => {
  it('it should allow regex', () => {
    class App extends Model<App> {
      reg = fnx.complex.regexp
    }

    const app = new App({ reg: /hello/i })

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"reg":"/\\/hello\\/i/\"}'

    expect(actual).toBe(expected)
  })

  it('it should allow complex functions', () => {
    function ret1() {
      return 1
    }
    function ret2() {
      return 2
    }
    class App extends Model<App> {
      ret = fnx.complex(
        (fn: typeof ret1 | typeof ret2) => {
          if (fn === ret1) {
            return 'one'
          } else if (fn === ret2) {
            return 'two'
          } else {
            throw new Error('invalid value')
          }
        },
        str => {
          if (str === 'one') {
            return ret1
          } else if (str === 'two') {
            return ret2
          } else {
            throw new Error('invalud value')
          }
        }
      )
    }

    const app = new App({ ret: ret1 })

    app.applySnapshot('{"ret":"two"}')

    const actual = app.ret()
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should throw on mutation of complex class props outside action', () => {
    class Animal {
      constructor(private sound: string) { }
      changeSound(newSound: string) {
        this.sound = newSound
      }
      speak() {
        return this.sound
      }
      toString() {
        return this.sound
      }
    }

    class App extends Model<App> {
      animal = fnx.complex(
        (a: Animal) => a.toString(),
        sound => new Animal(sound)
      )
    }

    const app = new App({ animal: new Animal('woof')})

    const actual = catchErrType(() => app.animal.changeSound('meow'))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow mutation of complex class props inside action', () => {
    class Animal {
      constructor(public sound: string) { }
      changeSound(newSound: string) {
        this.sound = newSound
      }
      speak() {
        return this.sound
      }
      toString() {
        return this.sound
      }
    }

    class App extends Model<App> {
      animal = fnx.complex(
        (a: Animal) => a.toString(),
        sound => new Animal(sound)
      )
      @fnx.action
      changeSound?(newSound: string) {
        this.animal.changeSound(newSound)
      }
    }

    const app = new App({ animal: new Animal('woof')})

    let runs = 0

    fnx.reaction(() => {
      runs++
      app.animal.speak()
    })

    app.changeSound('meow')

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should allow storing constructors as complex types', () => {
    class A { }
    class B { }
    class C { }

    class App extends Model<App> {
      construct = fnx.complex(
        (c: new () => A | B | C) => {
          if (c === A) {
            return 'A'
          } else if (c === B) {
            return 'B'
          } else if (c === C) {
            return 'C'
          } else {
            throw new Error('oh no!')
          }
        },
        str => {
          if (str === 'A') {
            return A
          } else if (str === 'B') {
            return B
          } else if (str === 'C') {
            return C
          } else {
            throw new Error('oh no oh no')
          }
        }
      )
    }

    const app = new App({ construct: A })

    const actual = catchErrType(() => new app.construct())
    const expected = Error

    expect(actual).toBe(expected)
  })
})
