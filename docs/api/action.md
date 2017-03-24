## `action(fn)`

Actions provide a controlled way to mutate the state of your application. They should be simple and synchronous.

[How do I handle asynchronous events like network requests?](/docs/patterns/AsynchronousActions.md)

```javascript
import { action, createObservable, string } from 'fnx'

class State {
  firstName = string
  lastName = string

  changeName = action(state => (firstName, lastName) => {
    state.firstName = firstName
    state.lastName = lastName
  })
}
```

As you can see above an `action` takes two functions composed together. The first one simply passes in the current context. The second one is the signature of this action when you call it in other places in your code.

Let's expand on the above example:

```javascript
...

const initialState = {
  firstName: 'Foo',
  lastName: 'Bar'
}

const state = createObservable(State, initialState)

state.changeName('First', 'Last')
```

After creating an observable the action is immediately accessible. It's signature is the same as the inner function we passed to `action` when we were creating the observable.

The only place you can mutate state is inside an action. If you try to mutate state anywhere else FNX will throw an error. Changes you make inside an action are immediate, but the [reactions](/docs/api/reaction.md) those changes may trigger are only executed after the action has finished.

### Context

The outer function you pass to an action is the one that receives the current context.

```javascript
action((self, root) => actionArguments => {
  ...
})
```

You will always take at least one parameter with this context function, `self`, a reference to the current object you are mutating. You may not always need this but FNX also passes in the root of the state tree as the second parameter to the context function. Feel free to ignore this if you don't need it.

### What about transactions?

Transactions do not exist in FNX. If you want to group multiple actions together simply call them while inside another action. Reactions will only be triggered when the outermost action has finished running.
