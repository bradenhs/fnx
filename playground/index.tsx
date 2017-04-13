// Import the entire api with the default export or grab
// exactly what you need with named imports
import fnx from 'fnx-local'
import ReactiveComponent from 'fnx-local/react'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

let nextTodoId = 0

class TodoModel extends fnx.Model<AppModel> {
  @fnx.readonly id = fnx.number
  text = fnx.string
  completed = fnx.boolean

  @fnx.action
  toggleComplete?() {
    this.completed = !this.completed
  }
}

class AppModel extends fnx.Model<AppModel> {
  filter = fnx.string
  todos = fnx.mapOf(fnx.object(TodoModel))

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

const app = new AppModel({
  filter: 'none',
  todos: { }
})

function logger(next, action) {
  console.log(action.path.join('.'), action.args)
  next()
}

app.use(logger)

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

ReactDOM.render(<App/>, document.querySelector('#app'))
