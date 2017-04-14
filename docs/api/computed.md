## `@computed`

Signature

```javascript
@computed classMethod
```

`@computed` describes a computed property on the state.

```javascript
import fnx from 'fnx'

class State extends fnx.Model {
  firstName = fnx.string
  lastName = fnx.string

  @fnx.computed fullName() {
    return this.firstName + ' ' + this.lastName
  }
}
```

The function decorated by `@computed` is the computation needed to be performed when getting this value.
FNX heavily optimizes this function so that it is called as infrequently as possible. Computed values
should be composed only of other observable properties in the same state tree. They can even be
composed of other computed values. Class methods decorated with `@computed` should accept no parameters.

When any property a computed value uses in it's computation is changed that computed property is marked
as stale. The next time the computed property is accessed a check is performed to see if it's stale or
not. If it is stale the computed value is calculated again. If it isn't stale the cache result of the
computed property is returned.

Just like in actions you can call `this.getRoot()` to get a reference to the root of the state tree
in your computed property method body.
