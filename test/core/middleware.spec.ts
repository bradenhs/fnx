import fnx, { Model } from '../../src/fnx'

describe('middleware', () => {
  it('verify middleware runs', () => {
    class App extends Model<App> {
      foo = fnx.string

      @fnx.action
      changeFoo?(value: string) {
        this.foo = value
      }
    }

    const app = new App({ foo: 'foo' })

    let runs = 0

    app.use((next) => {
      runs++
      next()
    })

    app.changeFoo('bar')

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })
  it('verify middleware executes actoin properly', () => {
    class App extends Model<App> {
      foo = fnx.string

      @fnx.action
      changeFoo?(value: string) {
        this.foo = value
      }
    }

    const app = new App({ foo: 'foo' })

    app.use((next) => {
      next()
    })

    app.changeFoo('bar')

    const actual = app.foo
    const expected = 'bar'

    expect(actual).toBe(expected)
  })
  it('verify middleware executes nested actoin properly', () => {
    class Obj extends Model<App> {
      @fnx.action
      changeFoo?(value: string) {
        this.getRoot().foo = value
      }
    }
    class App extends Model<App> {
      foo = fnx.string
      obj = fnx.object(Obj)
    }

    const app = new App({ obj: { }, foo: 'foo' })

    app.use((next) => {
      next()
    })

    app.obj.changeFoo('bar')

    const actual = app.foo
    const expected = 'bar'

    expect(actual).toBe(expected)
  })
  it('verify middleware executes order is correct', () => {
    class App extends Model<App> {
      foo = fnx.string

      @fnx.action
      changeFoo?(value: string) {
        this.foo = value
      }
    }

    const app = new App({ foo: 'foo' })

    const arr = []
    app.use((next) => {
      arr.push('1')
      next()
      arr.push('6')
    })
    app.use((next) => {
      arr.push('2')
      next()
      arr.push('5')
    })
    app.use((next) => {
      arr.push('3')
      next()
      arr.push('4')
    })

    app.changeFoo('bar')

    const actual = arr
    const expected = ['1', '2', '3', '4', '5', '6']

    expect(actual).toEqual(expected)
  })
  it('verify nested middleware executes order is correct', () => {
    class Obj extends Model<App> {
      @fnx.action
      changeFoo?(value: string) {
        this.getRoot().foo = value
      }
    }
    class App extends Model<App> {
      foo = fnx.string
      obj = fnx.object(Obj)
    }

    const app = new App({ obj: { }, foo: 'foo' })

    const arr = []
    app.use((next) => {
      arr.push('1')
      next()
      arr.push('12')
    })
    app.use((next) => {
      arr.push('2')
      next()
      arr.push('11')
    })
    app.use((next) => {
      arr.push('3')
      next()
      arr.push('10')
    })

    app.obj.use(next => {
      arr.push('4')
      next()
      arr.push('9')
    })
    app.obj.use(next => {
      arr.push('5')
      next()
      arr.push('8')
    })
    app.obj.use(next => {
      arr.push('6')
      next()
      arr.push('7')
    })

    app.obj.changeFoo('bar')

    const actual = arr
    const expected = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

    expect(actual).toEqual(expected)
  })
  it('verify middleware action path is correct (shallow)', () => {
    class App extends Model<App> {
      foo = fnx.string

      @fnx.action
      changeFoo?(value: string) {
        this.foo = value
      }
    }

    const app = new App({ foo: 'foo' })

    let path

    app.use((next, action) => {
      path = action.path.concat()
      next()
    })

    app.changeFoo('bar')

    const actual = path
    const expected = [ 'changeFoo' ]

    expect(actual).toEqual(expected)
  })
  it('verify middleware action path is correct (deep)', () => {
    class Obj extends Model<App> {
      @fnx.action
      changeFoo?(value: string) {
        this.getRoot().foo = value
      }
    }
    class App extends Model<App> {
      foo = fnx.string
      obj = fnx.object(Obj)
    }

    const app = new App({ obj: { }, foo: 'foo' })

    let path

    app.use((next, action) => {
      path = action.path.concat()
      next()
    })

    app.obj.changeFoo('bar')

    const actual = path
    const expected = [ 'obj', 'changeFoo' ]

    expect(actual).toEqual(expected)
  })
  it('verify middleware action path is correct (arrayOf)', () => {
    class Obj extends Model<App> {
      @fnx.action
      changeFoo?(value: string) {
        this.getRoot().foo = value
      }
    }
    class App extends Model<App> {
      foo = fnx.string
      objs = fnx.arrayOf(fnx.object(Obj))
    }

    const app = new App({ objs: [ { } ], foo: 'foo' })

    let path

    app.use((next, action) => {
      path = action.path.concat()
      next()
    })

    app.objs[0].changeFoo('bar')

    const actual = path
    const expected = [ 'objs', '0', 'changeFoo' ]

    expect(actual).toEqual(expected)
  })
  it('verify middleware action path is correct (mapOf)', () => {
    class Obj extends Model<App> {
      @fnx.action
      changeFoo?(value: string) {
        this.getRoot().foo = value
      }
    }
    class App extends Model<App> {
      foo = fnx.string
      objs = fnx.mapOf(fnx.object(Obj))
    }

    const app = new App({ objs: { hi: { } }, foo: 'foo' })

    let path

    app.use((next, action) => {
      path = action.path.concat()
      next()
    })

    app.objs.hi.changeFoo('bar')

    const actual = path
    const expected = [ 'objs', 'hi', 'changeFoo' ]

    expect(actual).toEqual(expected)
  })
  test('delivers correct return value', () => {
    class App extends Model<App> {
      @fnx.action
      return2?() {
        return 2
      }
    }

    const app = new App({})

    let returnValue

    app.use(next => {
      returnValue = next().returnValue
    })

    app.return2()

    const actual = returnValue
    const expected = 2

    expect(actual).toBe(expected)
  })
  test('actions inside of actions do not trigger middleware again', () => {
    class App extends Model<App> {
      @fnx.action
      second?() { }
      @fnx.action
      first?() {
        this.second()
      }
    }

    const app = new App({})

    let runs = 0

    app.use(next => {
      runs++
      next()
    })

    app.first()

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })
  test('removing middleware works', () => {
    class App extends Model<App> {
      @fnx.action
      test?() { }
    }

    const app = new App({})

    let runs = 0

    const testMiddleware = app.use(next => {
      runs++
      next()
    })

    app.test()

    testMiddleware.remove()

    app.test()

    const actual = runs
    const expected = 1

    expect(actual).toBe(expected)
  })

  test('not calling next should prevent action execution', () => {
    class App extends Model<App> {
      count = fnx.number

      @fnx.action
      increment?() {
        this.count++
      }
    }

    const app = new App({ count: 0 })

    app.use(() => 0)

    app.increment()

    const actual = app.count
    const expected = 0

    expect(actual).toBe(expected)
  })

  test('should work with objects nested in arrays', () => {
    class Obj extends Model<App> {
      @fnx.action
      increment?() {
        this.getRoot().count++
      }
    }

    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.object(Obj))
      count = fnx.number
    }

    const app = new App({ count: 0, arr: [ { } ]})

    let path

    app.use((next, action) => {
      path = action.path
      next()
    })

    app.arr[0].increment()

    const actual = path
    const expected = [ 'arr', '0', 'increment' ]

    expect(actual).toEqual(expected)
  })
})
