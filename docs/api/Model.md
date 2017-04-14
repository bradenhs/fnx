## `Model`

TODO

- For now just look at the below example

```javascript
import fnx from 'fnx'

class SubObject extends fnx.Model {
  str = fnx.string
}

class ParentObject extends fnx.Model {
  sub = fnx.object(SubObject)
}
```