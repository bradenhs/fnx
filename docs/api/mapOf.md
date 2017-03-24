## `mapOf(kind)`

`mapOf` describes an map in your state tree.

```javascript
import { mapOf, string } from 'fnx'

class State {
  stringMap = mapOf(string)
}
```

Maps are keyed with strings and the type of contents is determined by what you pass into the
`mapOf` function.
