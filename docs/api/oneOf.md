## `oneOf`

`oneOf` allows you to specify a property on the state tree as one of the types given.

```javascript
import fnx from 'fnx'

class State extends fnx.Model {
  numOrStr = fnx.oneOf(fnx.number, fnx.string)
}
```