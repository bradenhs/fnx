## `applyDiffs`

Signature:

```javascript
stateTreeInstance.applyDiffs(diffs: Diff[])
// where stateTreeInstance is an fnx.object, fnx.arrayOf, or fnx.mapOf
```

Apply diffs takes the diff object return by the `next` function in middlewares and applies it to the
state tree.

```javascript
import fnx from 'fnx'

class CounterOne extends fnx.Model {
  count = fnx.number

  @fnx.action
  increment() {
    this.count++
  }
}

class CounterTwo extends fnx.Model {
  count = fnx.number

  @fnx.action
  increment() {
    this.count++
  }
}

const counterOne = new CounterOne({
  count: 0
})

const counterTwo = new CounterOne({
  count: 0
})

counterOne.use(next => {
  counterTwo.applyDiffs(next().diff)
})

counterOne.increment()
counterOne.increment()
counterOne.increment()

counterOne.count === counterTwo.count // true
```

The above example shows how two structurally identical state trees could be kept in sync with using
middleware and the `applyDiffs` function. A great use case for this would be keeping two clients in
sync over the internet since the the `diff` object returned from the next function is serializable
with `JSON.stringify`.
