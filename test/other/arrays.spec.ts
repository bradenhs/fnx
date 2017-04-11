import fnx, { Model } from '../../src/fnx'
import { catchErrType } from '../testHelpers'

describe('arrays', () => {
  it('should allow arrays of arrays', () => {
    class App extends Model<App> {
      multi = fnx.arrayOf(fnx.arrayOf(fnx.number))
    }

    const app = new App({ multi: [ [ 1 ] ]})

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"multi":[[1]]}'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of booleans', () => {
    class App extends Model<App> {
      bools = fnx.arrayOf(fnx.boolean)
    }

    const app = new App({bools: [true, false]})

    const actual = app.bools.getSnapshot({ asString: true })
    const expected = '[true,false]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of maps', () => {
    class App extends Model<App> {
      maps = fnx.arrayOf(fnx.mapOf(fnx.boolean))
    }

    const app = new App({maps: [ { 1: true, 2: false}, { three: false } ] })

    const actual = app.maps.getSnapshot({ asString: true })
    const expected = '[{"1":true,"2":false},{"three":false}]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of complex types', () => {
    class App extends Model<App> {
      dates = fnx.arrayOf(fnx.complex.date)
    }

    const app = new App({ dates: [ new Date(1000), new Date(2000) ]})

    const actual = app.dates.getSnapshot({ asString: true })
    const expected = '["Thu, 01 Jan 1970 00:00:01 GMT","Thu, 01 Jan 1970 00:00:02 GMT"]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of numbers', () => {
    class App extends Model<App> {
      bools = fnx.arrayOf(fnx.number)
    }

    const app = new App({bools: [0, 1]})

    const actual = app.bools.getSnapshot({ asString: true })
    const expected = '[0,1]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of objects', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      objs = fnx.arrayOf(fnx.object(Obj))
    }

    const app = new App({objs: [ { hi: '0' }, { hi: 'one'} ]})

    const actual = app.objs.getSnapshot({ asString: true })
    const expected = '[{"hi":"0"},{"hi":"one"}]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of oneOfs', () => {
    class App extends Model<App> {
      numsOrBools = fnx.arrayOf(fnx.oneOf(fnx.boolean, fnx.number))
    }

    const app = new App({ numsOrBools: [ 0, false ]})

    const actual = app.numsOrBools.getSnapshot({ asString: true })
    const expected = '[0,false]'

    expect(actual).toBe(expected)
  })

  it('should allow arrays of strings', () => {
    class App extends Model<App> {
      strs = fnx.arrayOf(fnx.string)
    }

    const app = new App({strs: ['one', 'two']})

    const actual = app.strs.getSnapshot({ asString: true })
    const expected = '["one","two"]'

    expect(actual).toBe(expected)
  })

  it('should disallow arrays of anything else', () => {
    const actual = catchErrType(() => {
      fnx.arrayOf({ type: 'hi' })
    })
    const expected = Error
    expect(actual).toBe(expected)
  })

  it('should disallow setPrototypeOf', () => {
    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.string)
    }

    const app = new App({ arr: [] })

    const actual = catchErrType(() => Object.setPrototypeOf(app.arr, {}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow defineProperty', () => {
    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.string)
    }

    const app = new App({ arr: [] })

    const actual = catchErrType(() => Object.defineProperty(app.arr, 'hi', {}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow delete', () => {
    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.string)
      @fnx.action
      illegalDelete?() {
        delete this.arr[0]
      }
    }

    const app = new App({ arr: [] })

    const actual = catchErrType(() => app.illegalDelete() )
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow push', () => {
    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.string)

      @fnx.action
      push?() {
        this.arr.push('hi')
      }
    }

    const app = new App({ arr: [] })

    let runs = 0

    fnx.reaction(() => {
      runs++
      app.arr
    })

    app.push()

    const actual = runs
    const expected = 2

    expect(actual).toBe(expected)
  })

  it('should disallow symbols', () => {
    class App extends Model<App> {
      arr = fnx.arrayOf(fnx.string)
    }

    const arr = []
    arr[Symbol()] = 'hi'

    const actual = catchErrType(() => new App({ arr }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow assigning one observable to another', () => {
    class App extends Model<App> {
      arr1 = fnx.arrayOf(fnx.string)
      arr2 = fnx.arrayOf(fnx.string)

      @fnx.action
      swapArrays?() {
        const temp = this.arr2
        this.arr2 = this.arr1
        this.arr1 = temp
      }
    }

    const app = new App({ arr1: [ 'hi' ], arr2: [ 'bye' ] })

    app.swapArrays()

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"arr1":["bye"],"arr2":["hi"]}'

    expect(actual).toBe(expected)
  })
})
