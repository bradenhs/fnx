## `@optional`

`@optional` marks a property in the state tree as optional. To use this functionality of `fnx` you'll
need to enable ES7 decorators (see the [TypeScript](/docs/setup/TypeScript.md) or
[Babel](/docs/setup/Babel.md) setup pages for help with this).

```javascript
import fnx from 'fnx'

class State extends fnx.Model {
  firstName = fnx.string
  @fnx.optional lastName = fnx.string
}
```

The above marks the `lastName` property on the state as optional. By default all properties on your
state are required. If you try to create an object omitting any of it's properties you'll get an
error message. Using `@optional` allows you to omit properties when creating an object.
