## `@readonly`

`@readonly` marks a property in the state tree as readonly. To use this functionality of `fnx` you'll
need to [enable](/docs/more/decorators.md) `es7` decorators.

```javascript
import { string, readonly } from 'fnx'

class User {
  @readonly id = string

  firstName = string
  lastName = string
}
```

The above marks the `id` property on the state as readonly. By default all properties on your
state are able to be mutated inside of an action (no property is every able to mutated outside of
an action). `@readonly` takes this one step further and prevents a property from ever being mutated,
even from an action. When an object is initially created a readonly property can be defined but after
that inital creation of the object the readonly property cannot be changed. This is useful in
circumstances like shown above where after creating an object with an `id` you'll never want mutate
that `id` again.