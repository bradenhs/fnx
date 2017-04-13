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
help FNX reach `v1.0.0` by asking questions, finding bugs, and suggesting improvements.**

---

## Getting Started

**Install**

`yarn add fnx`  or  `npm install fnx`

**Starter Projects**

- [typescript-starter](https://github.com/fnxjs/typescript-starter)
- [babel-starter](https://github.com/fnxjs/babel-starter)

**Introduction**

FNX is a robust state management library optimized for ease of use. It's kinda like
[Redux](http://redux.js.org) met [MobX](http://mobx.js.org) and had a baby. If you're familiar
with either solution (or both) FNX shouldn't be too hard to grasp. FNX takes the best ideas from
both these libraries and adds a few of it's own. What you end up getting is
[transparently reactive](#transparent-reactive-programming)
state management complete with:

- [immutable serializable snapshots](/overview/Snapshots.html),
- [efficient derived properties](api/computed.html),
- support for observing [complex properties](api/complex.html) (such as native `Date` objects),
- free runtime typechecking,
- and a powerful [middleware api](/overview/Middleware.html) to top it off.

The icing on the cake is easy integration with React through the [ReactiveComponent](api/ReactiveComponent.html) api. In a way, FNX is kinda like React, but for data.
It abstracts away the tedious parts of state management (like serialization and keeping your view in
sync with your model) leaving you with more time to build awesome stuff.

Being the new kid on the block, FNX makes no compromises in order to support older JavaScript
environments. It started as part of an academic research project at
[Brigham Young University](https://byu.edu) and legacy support simply isn't part of the project's goals.
[Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
[WeakMaps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap),
and [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
are among the ES6 features FNX uses internally to provide the best state management solution possible.
The good news is that the vast majority of JavaScript runtime environments support these features
**today** (think pretty much everything minus IE11 and older). The bad news is that if you need
support for older environments FNX isn't for you.

**Simple Example**

Here's a basic React app using most of FNX's features. Checkout the
[TypeScript setup](/setup/TypeScript.html) page or
[Babel setup](/setup/Babel.html) page to learn how to properly configure your
project to work with FNX.

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

## Transparent Reactive Programming?

If that sounds hard and confusing to you, rest assured you are not alone. The good news is that
it's really a lot simpler than it seems. In reactive programming, reading data is the same as
subscribing to change notifications. You don't need to explicitly declare you want to rerun a
function when something changes – the function will run again automatically.

There are a lot of libraries out there designed to make reactive programming easier. One
such library is [RxJS](http://reactivex.io/rxjs). Libraries like RxJS,
however, are not _transparent_.  The transparent part means you can strip away all the fancy api
calls typically needed to make reactive programming work. [ES6 Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) enable
FNX to apply all of those methods behind the scenes without you needing to grok an entirely new
api just to perform simple mutations. Transparent reactive programming gives you
the advantages of reactive programming without the obtuse apis that often accomany it. Actually, you
won't need to change hardly anything about how you program. Simply mutate data inside of FNX
[actions](api/action.html). Transparency means you can use a utility library like
[Lodash](https://lodash.com) with no issues. Reactivity means FNX is silently taking notes of what's
going on and making sure your [computed](api/computed.html) values and view are
kept up-to-date with your data.

## Contributing

The biggest way to contribute to FNX currently is through feedback. The API is still in flux and the
internals are likely to undergo a major rewrite soon. The current version of the source code is a
good first draft but needs restructuring to allow some performance enhancements and to make it
easier to contribute to. Join the [gitter channel](https://gitter.im/fnxjs/fnx) or
[open an issue](https://github.com/fnxjs/fnx/issues/new) to give feedback or ask questions.
Suggestions and new ideas are welcome!
