## `ReactiveComponent`

`ReactiveComponent` is used with [React](https://facebook.github.io/react/) and can either be called as
a function to encapsulate a functional component or extended as a class to allow for stateful
components or ones that need lifecycle hooks.

It's important to note that `ReactiveComponent` is imported from 'fnx/react'.

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import ReactiveComponent from 'fnx/react'
import fnx from 'fnx'

class State extends fnx.Model {
  count = number

  @fnx.action
  increment() {
    this.count++
  }
}

const state = new State({
  count: 0
})

const Button = ReactiveComponent(() =>
  <button onClick={ state.increment }>Increment</button>
)

const Counter = ReactiveComponent(() =>
  <div>{ state.count }</div>
)

class App extends ReactiveComponent {
  render() {
    return <div>
      <Counter/>
      <Button/>
    </div>
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'))
```

Wrapping a component in `ReactiveComponent` or extending it create a
[PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent) that
re-renders when the state tree is updated in addition to when `props` or `state` are mutated. It
literally extends the [React.PureComponent](https://facebook.github.io/react/docs/react-api.html#react.purecomponent)
class and adds in the logic to re-render the component. Think of it like your render method being
wrapped in a [reaction](/docs/api/reaction.md).

This allow your view to be updated extremely efficiently since it minimizes the amount of work that
React is doing by having it only update those parts of the application that actually changed.
