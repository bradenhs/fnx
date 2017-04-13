## `arrayOf`

Signature:

```javascript
fnx.arrayOf(type: TypeDescriptor)
```

`arrayOf` describes an array in your state tree.

```javascript
import fnx from 'fnx'

class State {
  stringArray = fnx.arrayOf(fnx.string)
}
```
