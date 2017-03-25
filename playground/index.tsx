import { action, createObservable, number } from 'fnx-local'
import ReactiveComponent from 'fnx-local/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

class AppState {
  count = number
  increment? = action((app: AppState) => () => {
    app.count++
  })
}

const initialState: AppState = {
  count: 0,
}

const appState = createObservable(AppState, initialState)

const Counter = ReactiveComponent(() => {
  return <div onClick={ appState.increment }>
    { appState.count }
  </div>
})

class App extends ReactiveComponent<{}, {}> {
  render() {
    return <Counter/>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
