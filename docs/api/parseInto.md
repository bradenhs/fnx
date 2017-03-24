## `parseInto(string, observable)`

`parseInto` allow you to take a string and parse it into any observable property of type `object`,
`mapOf`, or `arrayOf` that is part of your state tree.

```javascript
import { parseInto, createObservable, number, action } from 'fnx'

class State {
  num = number
  setFromString = action(s => str => {
    parseInto(s, str)
  }
}

const initialState = {
  num: 1
}

const state = createObservable(State, initialState)

state.num // 1

state.setFromString('{"num":2}')

state.num // 2
```

Like anything that mutates state `parseInto` must be called from within an action to avoid errors.