## `createObservable(StateDescription, initialState)

Creates a new state tree out of the given state description and initial state.

```javascript
import { string } from 'fnx'

class State {
  foo = string
}

const initialState = {
  foo: 'bar'
}

const state = createObservable(State, initialState)

state.foo // 'bar'

```

Typically, you'll only use this function once in your application because you should only have one
state tree where all of your application's state is encapsulated. Technically, it is possible to have
more than one state tree but generally this is not the best practice.