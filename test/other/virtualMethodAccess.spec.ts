import fnx from '../../src/fnx'
import { catchErrType } from '../testHelpers'

/**
 * Use this file for constructing new test suites without having to worry about
 * running all the tests every single time.
 *
 * Run with `yarn run test-dev`
 */
describe('virtual method access', () => {
  it('allows getRoot', () => {
    class Sub extends fnx.Model<App> {
      @fnx.computed getRootNum?() {
        return this.getRoot().num
      }
    }
    class App extends fnx.Model<App> {
      num = fnx.number
      sub = fnx.object(Sub)
    }
    const app = new App({
      num: 3, sub: { }
    })

    const actual = app.sub.getRootNum()
    const expected = 3

    expect(actual).toBe(expected)
  })
  it('rejects setting toString on map', () => {
    class App extends fnx.Model<App> {
      hi = fnx.mapOf(fnx.string)
      @fnx.action break?() {
        this.hi.toString = () => 'hi'
      }
    }

    const app = new App({ hi: { } })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting toString on array', () => {
    class App extends fnx.Model<App> {
      hi = fnx.arrayOf(fnx.string)
      @fnx.action break?() {
        this.hi.toString = () => 'hi'
      }
    }

    const app = new App({ hi: [ ] })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting toString on object', () => {
    class App extends fnx.Model<App> {
      @fnx.action break?() {
        this.toString = () => 'hi'
      }
    }

    const app = new App({ })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting getSnapshot on map', () => {
    class App extends fnx.Model<App> {
      hi = fnx.mapOf(fnx.string)
      @fnx.action break?() {
        (this.hi as any).getSnapshot = () => 'hi'
      }
    }

    const app = new App({ hi: { } })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting getSnapshot on array', () => {
    class App extends fnx.Model<App> {
      hi = fnx.arrayOf(fnx.string)
      @fnx.action break?() {
        (this.hi as any).getSnapshot = () => 'hi'
      }
    }

    const app = new App({ hi: [ ] })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting getSnapshot on object', () => {
    class App extends fnx.Model<App> {
      @fnx.action break?() {
        (this as any).getSnapshot = () => 'hi'
      }
    }

    const app = new App({ })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting parse on map', () => {
    class App extends fnx.Model<App> {
      hi = fnx.mapOf(fnx.string)
      @fnx.action break?() {
        this.hi.parse = () => 'hi'
      }
    }

    const app = new App({ hi: { } })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting parse on array', () => {
    class App extends fnx.Model<App> {
      hi = fnx.arrayOf(fnx.string)
      @fnx.action break?() {
        this.hi.parse = () => 'hi'
      }
    }

    const app = new App({ hi: [ ] })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('rejects setting parse on object', () => {
    class App extends fnx.Model<App> {
      @fnx.action break?() {
        this.parse = () => 'hi'
      }
    }

    const app = new App({ })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
  it('allows setting getRoot on map', () => {
    class App extends fnx.Model<App> {
      hi = fnx.mapOf(fnx.string)
      @fnx.action work?() {
        this.hi.getRoot = 'hi'
      }
    }

    const app = new App({ hi: { } })

    app.work()

    const actual = app.hi.getRoot
    const expected = 'hi'

    expect(actual).toBe(expected)
  })
  it('allows setting getRoot on array', () => {
    class App extends fnx.Model<App> {
      hi = fnx.arrayOf(fnx.string)
      @fnx.action work?() {
        this.hi['getRoot'] = 'hi'
      }
    }

    const app = new App({ hi: [ ] })

    app.work()

    const actual = app.hi['getRoot']
    const expected = 'hi'

    expect(actual).toBe(expected)
  })
  it('rejects setting getRoot on object', () => {
    class App extends fnx.Model<App> {
      @fnx.action break?() {
        this.getRoot = () => 'hi'
      }
    }

    const app = new App({ })

    const actual = catchErrType(() => app.break())
    const expected = Error

    expect(actual).toBe(expected)
  })
})
