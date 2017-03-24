## `arrayOf(kind)`

`arrayOf` describes an array in your state tree.

```javascript
import { arrayOf, string } from 'fnx'

class State {
  stringArray = arrayOf(string)
}
```
