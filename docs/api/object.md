## `object(clazz)`

`object` takes a description class and defines an object in the state tree.

```javascript
import { object, number } from 'fnx'

class Foo {
  num = number
}

class Bar {
  foo = object(Foo)
}
```
