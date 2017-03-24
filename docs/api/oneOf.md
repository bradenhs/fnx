## `oneOf(t1, t2, ... , tn)`

`oneOf` allows you to specify a property on the state tree as one of the types given.

```javascript
import { oneOf, number, string }

class State {
  numOrStr = oneOf(number, string)
}
```