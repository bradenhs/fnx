## `complex`

Signature:

```javascript
complex(serialize: Function, deserialize: Function)
```

`complex` describes a complex property in your state tree.

```javascript
import fnx from 'fnx'

class State extends fnx.Model {
  date = fnx.complex(d => d.toUTCString(), v => new Date(v))
}
```

The first function provider serializes the complex value. In this case we serialize the date object
into it's UTC string representation. The second function takes this serialized value and converts it
back into the complex type. In this case that is easy. Simply constructing a date from the string
works.

These two functions should be completely pure and should be exact inverses of each other. Since dates
are such a common use case for complex types they're actually built into fnx along with regular
expressions. This is the code behind them:

```javascript
// Date
complex.date = complex(d => d.toUTCString(), v => new Date(v))

// Regular Expression
complex.regexp = complex(r => r.toString(), v => new RegExp(v))
```
