## `complex(serialize, deserialize)`

`complex` describes a complex property in your state tree.

```javascript
import { complex } from 'fnx'

class State {
  date = complex(d => d.toUTCString(), v => new Date(v))
}
```

The first function provider serializes the complex value. In this case we serialize the date object
into it's UTC string representation. The second function takes this serialized value and converts it
back into the complex type. In this case that is easy. Simply constructing a date from the string
works.

These two functions should be completely pure and should be exact inverses of each other.
