import fnx, { Model } from '../../src/fnx'
import { catchErrType } from '../testHelpers'

describe('objects', () => {
  it('should throw error if trying to set object to non-object', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }

    class App extends Model<App> {
      obj = fnx.object(Obj)
      @fnx.action
      illegalAssign?() {
        (this as any).obj = 5
      }
    }

    const app = new App({ obj: { hi: 'hi' }})

    const actual = catchErrType(() => app.illegalAssign())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow setPrototypeOf', () => {
    class Obj extends Model<App> { }
    class App extends Model<App> {
      obj = fnx.object(Obj)
      @fnx.action
      illegalAction?() {
        Object.setPrototypeOf(this.obj, {})
      }
    }

    const app = new App({ obj: {} })

    const actual = catchErrType(() => app.illegalAction())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow defineProperty', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      obj = fnx.object(Obj)
      @fnx.action
      illegalAction?() {
        Object.defineProperty(this.obj, 'hi', 'hi')
      }
    }

    const app = new App({ obj: { hi: 'bye' } })

    const actual = catchErrType(() => app.illegalAction())
    const expected = TypeError

    expect(actual).toBe(expected)
  })

  it('should disallow delete', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      obj = fnx.object(Obj)

      @fnx.action
      illegalAction?() {
        delete this.obj.hi
      }
    }

    const app = new App({ obj: { hi: 'hi' } })

    const actual = catchErrType(() => app.illegalAction())
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow assigning object outside action', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      obj = fnx.object(Obj)
    }
    const app = new App({ obj: { hi: 'hi' }})

    const actual = catchErrType(() => app.obj = { hi: 'bye' })
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should disallow setting symbols on object', () => {
    class App extends Model<App> { }
    const actual = catchErrType(() => new App({ [Symbol()]: 0 }))
    const expected = Error

    expect(actual).toBe(expected)
  })

  it('should allow assigning object inside action', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      obj = fnx.object(Obj)

      @fnx.action
      assign?() {
        this.obj = { hi: 'bye' }
      }
    }
    const app = new App({ obj: { hi: 'hi' }})

    app.assign()

    const actual = app.toString()
    const expected = '{"obj":{"hi":"bye"}}'

    expect(actual).toBe(expected)
  })
})
