## `@optional`

`@optional` marks a property in the state tree as optional. To use this functionality of `fnx` you'll
need to [enable](/docs/more/decorators.md) `es7` decorators.

```javascript
import { string, optional } from 'fnx'

class State {
  firstName = string
  @optional lastName = string
}
```

The above marks the `lastName` property on the state as optional. By default all properties on your
state are required. If you try to create an object omitting any of it's properties you'll get an
error message. Using `@optional` allows you to omit properties when creating an object.