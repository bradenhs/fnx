<p align="right">
  <a href="https://www.github.com/fnxjs/fnx">
    <img src="https://img.shields.io/github/stars/fnxjs/fnx.svg?style=social&label=Star" alt="github stars">
  </a>
</p>

<br/>

<p align="center">
  <a href="https://fnx.js.org">
    <img src="https://cdn.rawgit.com/fnxjs/fnx/51fdcc43/logo/logo.svg" alt="FNX - Wickedly quick, stunningly simple, reactive state management."/>
  </a>
</p>

<p align="center">
  Wickedly quick, stunningly simple, reactive state management.
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

<p align="center">
  <a href="https://www.npmjs.com/package/fnx">
    <img src="https://img.shields.io/npm/v/fnx.svg?style=flat" alt="npm version">
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.npmjs.com/package/fnx">
    <img src="https://img.shields.io/npm/dm/fnx.svg?style=flat" alt="npm downloads/month">
  </a>
</p>

<br/>

## Getting Started

FNX is a work in progress. Stay tuned!

### Some Thoughts (not well formed - just notes to myself really)

This is a good article: https://danielearwicker.github.io/json_mobx_Like_React_but_for_Data_Part_2_.html

Some things here are based on it

> Think of it like react for data.

> It's not practical or necessary to eliminate mutable data.

FNX actions do not appear to be pure functions and they aren't. The way they are called however and
what they do can be thought of in a functional way however. Basically FNX gives you all the good parts
about functional programming and all the good parts about mutability.

This isn't what fnx actually does but you can think about your actions being wrapped in this code:

```
function getNewState(currentState, action) {
  const clonedState = cloneDeep(currentState)

  action(clonedState) // code you write

  return clonedState
}

// getNewState is a pure function
state = getNewState(state, action)

```

Then it triggers a bunch of side effects.
