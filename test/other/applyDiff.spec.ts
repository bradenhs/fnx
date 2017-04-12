import fnx, { Model } from '../../src/fnx'

describe('apply diff', () => {
  it ('should apply diffs properly', () => {
    class Deep extends Model<One> {
      num = fnx.number
      @fnx.action increment?() {
        this.num++
      }
    }
    class Obj extends Model<One> {
      deep = fnx.object(Deep)
      arr = fnx.arrayOf(fnx.boolean)
    }
    class One extends Model<One> {
      str = fnx.string
      @fnx.optional num = fnx.number
      bool = fnx.boolean
      obj = fnx.object(Obj)
      map = fnx.mapOf(fnx.complex.date)

      @fnx.action setStr?(value: string) {
        this.str = value
      }

      @fnx.action randomStuff?() {
        this.bool = false
        this.obj = { arr: [ false, true ], deep: { num: 0 } }
        this.map = { a100: new Date(100) }
      }

      @fnx.action removeNum?() {
        delete this.num
      }
    }
    class Two extends One { }

    const initialState: One = {
      str: 'hi',
      num: 3,
      bool: false,
      obj: { arr: [ true, false ], deep: { num: -1 } },
      map: { }
    }
    const initialState2: One = {
      str: 'hi',
      num: 3,
      bool: false,
      obj: { arr: [ true, false ], deep: { num: -1 } },
      map: { }
    }

    const one = new One(initialState)
    const two = new Two(initialState2)

    one.use(next => {
      two.applyDiffs(next().diff)
    })

    one.setStr('hello')
    one.randomStuff()
    one.removeNum()
    one.obj.deep.increment()
    one.obj.deep.increment()

    const actual = two.getSnapshot({ asString: true })
    const expected = one.getSnapshot({ asString: true })

    expect(actual).toBe(expected)
  })
})
