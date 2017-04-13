## `mapOf`

**Signature**

```javascript
mapOf(kind: TypeDescriptor)
```

`mapOf` describes an map in your state tree.

```javascript
import fnx from 'fnx'

class State {
  stringMap = fnx.mapOf(fnx.string)
}
```

Maps are keyed with strings and the type of contents is determined by what you pass into the
`mapOf` function.
