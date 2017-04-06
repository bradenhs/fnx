import fnx, { action, readonly } from 'fnx-local'
import ReactiveComponent from 'fnx-local/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

class Model extends fnx.Model<App> { }

class App extends Model {
  count = fnx.number

  @readonly
  date = fnx.complex.date

  @action
  increment?() {
    this.count++
  }
}

const app = new App({
  count: 0,
  date: new Date()
})

const Counter = ReactiveComponent(() => {
  return <div onClick={ app.increment }>
    { app.count }
  </div>
})

interface IProps {
  word: string
}

class Main extends ReactiveComponent<IProps, {}> {
  render() {
    return <div>
      { this.props.word }
      <Counter/>
    </div>
  }
}

ReactDOM.render(<Main word='hi'/>, document.getElementById('app'))
