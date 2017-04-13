// Import the entire api with the default export or grab
// exactly what you need with named imports
import fnx from 'fnx-local'

// ReactiveComponent is excluded from the top-level api so
// you have to import it from 'fnx/react'
import ReactiveComponent from 'fnx-local/react'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

let nextTodoId = 0

// All fnx models must extend fnx.Model. To learn about
// avoiding the some of the pitfalls of using classes see
// https://fnx.js.org/patterns/Mixins.html
class TodoModel extends fnx.Model<AppModel> {

  // Properties can't be mutated outside of actions but
  // if you'd like to protect them from being mutated at
  // all after they've been initialize you can mark
  // them as readonly
  @fnx.readonly id = fnx.number

  text = fnx.string
  completed = fnx.boolean

  // Actions are the only way to mutate your state tree
  // and are simple methods directly on your models.
  @fnx.action
  toggleComplete?() {
    this.completed = !this.completed
  }
}

class AppModel extends fnx.Model<AppModel> {
  filter = fnx.string
  todos = fnx.mapOf(fnx.object(TodoModel))

  // Computed methods take no arguments and cache their
  // results after being run. Mutating any property of the
  // state tree used in the computation invalidates it's
  // cache. The next time it's called the cached value
  // will be recalcuated.
  @fnx.computed
  getVisibleTodos?() {
    const todoArray = Object.keys(this.todos).map(id => this.todos[id])
    if (this.filter === 'completed') {
      return todoArray.filter(todo => todo.completed)
    } else if (this.filter === 'uncompleted') {
      return todoArray.filter(todo => !todo.completed)
    } else {
      return todoArray
    }
  }

  @fnx.action
  changeFilter?(filter) {
    this.filter = filter
  }

  @fnx.action
  addTodo?(text) {
    this.todos[nextTodoId] = {
      id: nextTodoId, text, completed: false
    }
    nextTodoId++
  }
}

// Create our state tree by instantiating the AppModel with
// an initial value for the state tree
const app = new AppModel({
  filter: 'none',
  todos: { }
})

function logger(next, action) {
  console.log(action.path.join('.'), action.args)
  next()
}

// Add a middleware to log out the current action being triggered
app.use(logger)

// Wrap functional components with ReactiveComponent to observe
// properties of the state tree access during their render. Anytime
// one of these properties changes this component will automatically
// be rerendered.
const Todo = ReactiveComponent(({ todo }) => {
  return <div onClick={ () => todo.toggleComplete() }>
    { todo.completed ? <s>{ todo.text }</s> : todo.text }
  </div>
})

const TodoList = ReactiveComponent(() => {
  return <div>
    { app.getVisibleTodos().map(todo => {
      return <Todo key={ todo.id } todo={ todo }/>
    }) }
  </div>
})

// You can also create traditional React components by extending
// ReactiveComponent. Behind the scenes ReactiveComponent extends
// React.PureComponent. See https://fnx.js.org/api/ReactiveComponent.html
// for a thorough explanation.
class TodoComposer extends ReactiveComponent<{}, {}> {
  inputEl

  render() {
    return <div>
      <input ref={ c => this.inputEl = c }/>
      <button onClick={ () => this.addTodo() }>Add</button>
    </div>
  }

  addTodo() {
    app.addTodo(this.inputEl.value)
    this.inputEl.value = ''
  }
}

class FilterControl extends ReactiveComponent<{}, {}> {
  render() {
    return <div>
      Filter
      <select value={ app.filter } onChange={ event => this.handleChange(event) }>
        <option value='none'>None</option>
        <option value='completed'>Completed</option>
        <option value='uncompleted'>Uncompleted</option>
      </select>
    </div>
  }

  handleChange(event) {
    app.changeFilter(event.target.value)
  }
}

const App = ReactiveComponent(() => {
  return <div>
    <h1>Todos</h1>
    <FilterControl/>
    <TodoComposer/>
    <TodoList/>
  </div>
})

// No need to render the root of the App more than once!
// ReactiveComponent will take of making sure individual
// components are rerendered anytime parts of the state
// tree they depend on are changed.
ReactDOM.render(<App/>, document.querySelector('#app'))
