## `computed(fn)`

`computed` describes a computed property on the state.

```javascript
import { computed, string } from 'fnx'

class State {
  firstName = string
  lastName = string

  fullName = computed(s => s.firstName + ' ' + s.lastName)
}
```

The function provided to computed is the computation needed to be performed when getting this value.
FNX heavily optimizes this function so that it is called as infrequently as possible. Computed values
should be composed only of other observable properties in the same state tree. They can even be
composed of other computed values!

The fuction provided takes up to two parameters. The first is the current object being mutated. In this
example is would be the particular instance of `State` the computed property is accessed from. The second
property is the root of the state tree. Here's an example of where this might be useful:

```javascript
import { computed, mapOf, string, readonly, object } from 'fnx'

class User {
  @readonly id = string

  firstName = string
  lastName = string
}

class Message {
  @readonly id = string

  contents = string
  authorId = string
  author = computed((message, root) => root.users[message.authorId])
}

class State {
  users = mapOf(object(User))
  messages = mapOf(object(Message))
}
```

Now the author of message can be accessed directly from the message object without having duplicate
data. Remember that FNX heavily optimizes how often computations are run. There values are cached
and only calculated after being accessed when in a stale state. Computations are marked as stale
when any of the observable properties accessed in there last run are mutated. If multiple computed
values are nested within each other anytime a computation is marked as stale all of it's dependent
computations are marked as stale as well. This algorithm ensures computations are run only when
absolutely neccessary.