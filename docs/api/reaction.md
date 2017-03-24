## `reaction(fn)`

`reaction` initializes a reaction. The function provided is run once immediately and then again any
time any of the observable properties accessed in it's last run are mutated.

```javascript
import { reaction, action, createObservable, number } from 'fnx'

class State {
  count = number
  increment = action(s => () => {
    s.count++
  })
}

const initialState = {
  count: 0
}

const state = createObservable(State, initialState)

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
