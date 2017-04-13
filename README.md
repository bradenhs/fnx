<p align="center">
  <a href="https://fnx.js.org">
    <img width="580" src="https://cdn.rawgit.com/fnxjs/fnx/13b83156/assets/logo.svg" alt="FNX - Wickedly quick, stunningly simple, reactive state management."/>
  </a>
</p>

<p align="center">
  Wickedly quick, stunningly simple, reactive state management.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/fnx">
    <img src="https://img.shields.io/npm/v/fnx.svg?style=flat" alt="npm version">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/fnx">
    <img src="https://img.shields.io/npm/dm/fnx.svg?style=flat" alt="npm downloads/month">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://gitter.im/fnxjs/fnx">
    <img src="https://img.shields.io/gitter/room/fnxjs/fnx.svg?style=flat" alt="chat on gitter">
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/fnxjs/fnx">
    <img src="https://img.shields.io/travis/fnxjs/fnx/master.svg?style=flat" alt="build status">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://coveralls.io/github/fnxjs/fnx?branch=master">
    <img src="https://img.shields.io/coveralls/fnxjs/fnx/master.svg?style=flat" alt="test coverage">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://en.wikipedia.org/wiki/MIT_License">
    <img src="https://img.shields.io/github/license/fnxjs/fnx.svg?style=flat" alt="fnx license">
  </a>
</p>

<br/>

---

**FNX aspires to be a rock-solid, production-ready, state management solution. Currently, however,
FNX is in its early stages. Until `v1.0.0` don't use it for anything critical. You can
help FNX reach `v1.0.0` by asking questions, finding bugs, or suggesting improvements.**

---

_Clone the [typescript-starter](https://github.com/fnxjs/typescript-starter) repository or
[babel-starter](https://github.com/fnxjs/babel-starter) repository for an example of FNX in action._

---

## Getting Started

**Install**

`yarn add fnx`  or  `npm install fnx`

**Introduction**

FNX is a powerful state management library optimized for ease of use. It's kinda like
[Redux](https://redux.js.org) met [MobX](https://mobx.js.org) and had a baby. If you're familiar
with either library (or both) FNX shouldn't be too hard to grasp. FNX takes the best ideas from
both these libraries and adds a few of it's own. What you end up getting is transparently reactive
state management complete with immutable snapshots, easy serialization, efficient derived properties,
and a powerful middleware api. FNX enforces at runtime the shape of your state tree based on the
description you provide. Easy integration with React is available through the
[ReactiveComponent](https://fnx.js.org/api/ReactiveComponent.html)
api. In a way FNX is kinda like React but for data. It abstracts away the tedious parts
of state management like serialization and keeping your view in sync with your data.

As the new kid on the block, FNX makes no compromises in order to support older enviroments.
[Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
[WeakMaps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap),
and [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
are among the ES6 features FNX uses internally to provide the best state management solution possible.
The good news is that the vast majority of javascript runtime environments support these features
**today** (think pretty much everything minus IE11 and older). The bad news is that if you need
support older environments FNX isn't for you.

**Example**

Here's a simple React app using most of FNX's features. Checkout the
[TypeScript setup](https://fnx.js.org/setup/TypeScript.html) page or
[Babel setup](https://fnx.js.org/setup/Babel.html) page to properly configure a project to run FNX.

```javascript
import fnx from 'fnx'
import ReactiveComponent from 'fnx/react'
import React from 'react'
import ReactDOM from 'react-dom'

let nextTodoId = 0

// Describe the state tree

class TodoModel extends fnx.Model {
  @fnx.readonly id = fnx.number
  text = fnx.string
  completed = fnx.boolean

  @fnx.action
  toggleComplete() {
    this.completed = !this.completed
  }
}

class AppModel extends fnx.Model {
  filter = fnx.string
  todos = fnx.mapOf(fnx.object(TodoModel))

  @fnx.computed
  getVisibleTodos() {
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
  changeFilter(filter) {
    this.filter = filter
  }

  @fnx.action
  addTodo(text) {
    this.todos[nextTodoId] = {
      id: nextTodoId, text, completed: false
    }
    nextTodoId++
  }
}

// Initialize the state tree

const app = new AppModel({
  filter: 'none',
  todos: { }
})

app.use(logger)

function logger(next, action) {
  console.log(action.path.join('.'), action.args)
  next()
}

// Components

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

class TodoComposer extends ReactiveComponent {
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

class FilterControl extends ReactiveComponent {
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

// Render the app

ReactDOM.render(<App/>, document.querySelector('#app'))
```

## Contributing

The biggest way to contribute to FNX currently is through feedback. The API is still in flux and the
internals are likely to undergo a major rewrite soon. The current version of the source code is a
good first draft but needs restructuring to allow some performance enhancements and to make it
easier to contribute to. Join the [gitter channel](https://gitter.im/fnxjs/fnx) or
[open an issue](https://github.com/fnxjs/fnx/issues/new) to give feedback or ask questions.
Suggestions and new ideas are welcome!
