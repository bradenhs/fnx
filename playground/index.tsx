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

const c = ReactiveComponent

const Counter = c(() => {
  return <div onClick={ appState.increment }>
    { appState.count }
  </div>
})

interface IProps {
  word: string
}

class App extends ReactiveComponent<IProps, {}> {
  render() {
    return <div>
      { this.props.word }
      <Counter/>
    </div>
  }
}

ReactDOM.render(<App word='hi'/>, document.getElementById('app'))
