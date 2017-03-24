## `@readonly`

`@readonly` marks a property in the state tree as readonly. To use this functionality of `fnx` you'll
need to enable ES7 decorators.

```javascript
import { string, readonly } from 'fnx'

class User {
  @readonly id = string

  firstName = string
  lastName = string
}
```

The above marks the `id` property on the state as readonly. By default all properties on your
state are able to be mutated inside of an action (no property is every able to mutated outside of
an action). `@readonly` takes this one step further and prevents a property from ever being mutated,
even from an action. When an object is initially created a readonly property can be defined but after
that inital creation of the object the readonly property cannot be changed. This is useful in
circumstances like shown above where after creating an object with an `id` you'll never want mutate
that `id` again.

### Decorators

**TypeScript**

Enable the `experimentalDecorators` options in `tsconfig.json` like this:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
  }
}
```

Either that or use the `--experimentalDecorators` flag when running the compiler.

**Babel**

Install the babel decorators package: `npm i --save-dev babel-plugin-transform-decorators-legacy`.
Then you can enable it in your `.babelrc` file:

```json
{
  "presets": [
    "es2015",
    "stage-1"
  ],
  // Make sure to list this plugin first in your list
  "plugins": [ "transform-decorators-legacy" ]
}
```

When using react native, the following preset can be used instead of `transform-decorators-legacy`:

```json
{
  "presets": ["stage-2", "react-native-stage-0/decorator-support"]
}
```