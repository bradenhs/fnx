import fnx, { Model } from '../../src/fnx'
import { catchErrType } from '../testHelpers'

describe('maps', () => {
  it('should allow maps of maps', () => {
    class App extends Model<App> {
      multi = fnx.mapOf(fnx.mapOf(fnx.number))
    }

    const app = new App({ multi: { hi: { bye: 1 } } })

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"multi":{"hi":{"bye":1}}}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of booleans', () => {
    class App extends Model<App> {
      bools = fnx.mapOf(fnx.boolean)
    }

    const app = new App({ bools: { t: true, f: false}})

    const actual = app.bools.getSnapshot({ asString: true })
    const expected = '{"t":true,"f":false}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of arrays', () => {
    class App extends Model<App> {
      maps = fnx.mapOf(fnx.arrayOf(fnx.boolean))
    }

    const app = new App({maps: { 1: [ true, false ] } })

    const actual = app.maps.getSnapshot({ asString: true })
    const expected = '{"1":[true,false]}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of complex types', () => {
    class App extends Model<App> {
      dates = fnx.mapOf(fnx.complex.date)
    }

    const app = new App({ dates: { 1000: new Date(1000), 2000: new Date(2000) }})

    const actual = app.dates.getSnapshot({ asString: true })
    const expected =
      '{"1000":"Thu, 01 Jan 1970 00:00:01 GMT","2000":"Thu, 01 Jan 1970 00:00:02 GMT"}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of numbers', () => {
    class App extends Model<App> {
      bools = fnx.mapOf(fnx.number)
    }

    const app = new App({bools: { 0: 1 }})

    const actual = app.bools.getSnapshot({ asString: true })
    const expected = '{"0":1}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of objects', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      objs = fnx.mapOf(fnx.object(Obj))
    }

    const app = new App({objs: { one: { hi: '0' }, two: { hi: 'one'} }})

    const actual = app.objs.getSnapshot({ asString: true })
    const expected = '{"one":{"hi":"0"},"two":{"hi":"one"}}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of oneOfs', () => {
    class App extends Model<App> {
      numsOrBools = fnx.mapOf(fnx.oneOf(fnx.boolean, fnx.number))
    }

    const app = new App({ numsOrBools: { hi: 0, bye: false }})

    const actual = app.numsOrBools.getSnapshot({ asString: true })
    const expected = '{"hi":0,"bye":false}'

    expect(actual).toBe(expected)
  })

  it('should allow maps of strings', () => {
    class App extends Model<App> {
      strs = fnx.mapOf(fnx.string)
    }

    const app = new App({strs: {one:'one', two:'two'}})

    const actual = app.strs.getSnapshot({ asString: true })
    const expected = '{"one":"one","two":"two"}'

    expect(actual).toBe(expected)
  })

  it('should disallow maps of anything else', () => {
    const actual = catchErrType(() => {
      fnx.mapOf({ type: 'hi' })
    })
    const expected = Error
    expect(actual).toBe(expected)
  })

  it('should disallow setPrototypeOf', () => {
    class App extends Model<App> {
      arr = fnx.mapOf(fnx.string)
    }

    const app = new App({ arr: {} })

    const actual = catchErrType(() => Object.setPrototypeOf(app.arr, {}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow defineProperty', () => {
    class App extends Model<App> {
      arr = fnx.mapOf(fnx.string)
    }

    const app = new App({ arr: {} })

    const actual = catchErrType(() => Object.defineProperty(app.arr, 'hi', {}))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow delete', () => {
    class App extends Model<App> {
      map = fnx.mapOf(fnx.string)
      @fnx.action
      legalDelete?() {
        delete this.map['one']
      }
    }

    const app = new App({ map: { one: 'hi' } })

    app.legalDelete()

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"map":{}}'

    expect(actual).toBe(expected)
  })

  it('should disallow symbols', () => {
    class App extends Model<App> {
      map = fnx.mapOf(fnx.string)
    }

    const map = {}
    map[Symbol()] = 'hi'

    const actual = catchErrType(() => new App({ map }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow assigning one observable to another', () => {
    class App extends Model<App> {
      map1 = fnx.mapOf(fnx.string)
      map2 = fnx.mapOf(fnx.string)

      @fnx.action
      swapMaps?() {
        const temp = this.map2
        this.map2 = this.map1
        this.map1 = temp
      }
    }

    const app = new App({ map1: { hi: 'hi' }, map2: { bye: 'bye' } })

    app.swapMaps()

    const actual = app.getSnapshot({ asString: true })
    const expected = '{"map1":{"bye":"bye"},"map2":{"hi":"hi"}}'

    expect(actual).toBe(expected)
  })
})
