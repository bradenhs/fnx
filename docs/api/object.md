## `object(clazz)`

`object` takes a description class and defines an object in the state tree.

```javascript
import fnx from 'fnx'

class Foo extends fnx.Model {
  num = fnx.number
}

class Bar {
  foo = fnx.object(Foo)
}
```
