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