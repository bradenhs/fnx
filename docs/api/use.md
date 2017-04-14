## `use`

TODO

For now only the example:

```javascript
import fnx from 'fnx'

class App extends fnx.Model {
  count = fnx.number

  @fnx.action
  increment() {
    this.count++
  }
}

const app = new App({
  count: 0
})

app.use(logger)
app.use(diffHistoryRecorder)

function logger(next, action) {
  console.log(action)
  next()
}

const diffHistory = []

function diffHistoryRecorder(next) {
  diffHistory.push(next().diff)
}

setInterval(app.increment, 1000)
```

The above code creates a counter that logs out all actions and records the result of those actions
in a diff history array. These diffs are serializable and could conceivably be used to keep the data
of two clients in sync.
