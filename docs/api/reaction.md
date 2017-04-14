## `reaction`

`reaction` initializes a reaction. The function provided is run once immediately and then again any
time any of the observable properties accessed in it's last run are mutated.

```javascript
import fnx from 'fnx'

class State extends fnx.Model {
  count = fnx.number

  @fnx.action
  increment() {
    this.count++
  }
}

const state = new State({
  count: 0
})

reaction(() => {
  console.log(state.count)
})

state.increment()
```

The above code will output:
```
0
1
```

Actions should not be called directly in a reaction.
