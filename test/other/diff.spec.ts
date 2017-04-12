import fnx, { Model } from '../../src/fnx'

describe('diff', () => {
  test('diff should work with string', () => {
    class App extends Model<App> {
      str = fnx.string

      @fnx.action changeValue?(value: string) {
        this.str = value
      }
    }

    const app = new App({ str: 'hi' })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.changeValue('hello')

    const actual = diff

    const expected = [ { path: ['str'], from: 'hi', to: 'hello' } ]

    expect(actual).toEqual(expected)
  })

  test('diff should work with optional values', () => {
    class App extends Model<App> {
      @fnx.optional str? = fnx.string

      @fnx.action changeValue?(value: string) {
        this.str = value
      }
    }

    const app = new App({ })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.changeValue('hello')

    const actual = diff

    const expected = [ { path: ['str'], to: 'hello' } ]

    expect(actual).toEqual(expected)
  })

  test('diff should work with deleting optional values', () => {
    class App extends Model<App> {
      @fnx.optional str? = fnx.string

      @fnx.action doDelete?() {
        delete this.str
      }
    }

    const app = new App({ str: 'hi' })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.doDelete()

    const actual = diff

    const expected = [ { path: ['str'], from: 'hi' } ]

    expect(actual).toEqual(expected)
  })

  test('diff should work deleting values from maps', () => {
    class App extends Model<App> {
      map = fnx.mapOf(fnx.number)

      @fnx.action removeKey?(key: string) {
        delete this.map[key]
      }
    }

    const app = new App({ map: { hello: 5 } })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.removeKey('hello')

    const actual = diff
    const expected = [ { from: 5, path: [ 'map', 'hello' ]}]

    expect(actual).toEqual(expected)
  })

  it('should work with objects', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      map = fnx.mapOf(fnx.object(Obj))
      @fnx.action addItem?(key: string, value: string) {
        this.map[key] = { hi: value }
      }
    }
    const app = new App({ map: { } })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.addItem('key', 'value')

    const actual = diff
    const expected = [ { path: ['map', 'key'], to: { hi: 'value' } } ]

    expect(actual).toEqual(expected)
  })

  it('should work with multiple mutations', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      map = fnx.mapOf(fnx.object(Obj))
      @fnx.action addItem?(key: string, value: string) {
        this.map[key] = { hi: value }
        this.map[key + 'hi'] = { hi: value }
        this.map[key + 'hi'].hi = value + 'what'
      }
    }
    const app = new App({ map: { } })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.addItem('key', 'value')

    const actual = diff
    const expected = [
      { path: ['map', 'key'], to: { hi: 'value' } },
      { path: ['map', 'keyhi'], to: { hi: 'value' } },
      { path: ['map', 'keyhi', 'hi'], from: 'value', to: 'valuewhat' },
    ]

    expect(actual).toEqual(expected)
  })

  it('should always return the last mutation', () => {
    class Obj extends Model<App> {
      hi = fnx.string
    }
    class App extends Model<App> {
      map = fnx.mapOf(fnx.object(Obj))
      @fnx.action addItem?(key: string, value: string) {
        this.map[key] = { hi: value }
        this.map[key + 'hi'] = { hi: value }
        this.map[key + 'hi'].hi = value + 'what'
      }
    }
    const app = new App({ map: { } })

    let diff

    app.use(next => {
      diff = next().diff
    })

    app.addItem('what', 'the')

    app.addItem('key', 'value')

    const actual = diff
    const expected = [
      { path: ['map', 'key'], to: { hi: 'value' } },
      { path: ['map', 'keyhi'], to: { hi: 'value' } },
      { path: ['map', 'keyhi', 'hi'], from: 'value', to: 'valuewhat' },
    ]

    expect(actual).toEqual(expected)
  })
})
