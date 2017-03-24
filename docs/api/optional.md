## `@optional`

`@optional` marks a property in the state tree as optional. To use this functionality of `fnx` you'll
need to enable ES7 decorators.

```javascript
import { string, optional } from 'fnx'

class State {
  firstName = string
  @optional lastName = string
}
```

The above marks the `lastName` property on the state as optional. By default all properties on your
state are required. If you try to create an object omitting any of it's properties you'll get an
error message. Using `@optional` allows you to omit properties when creating an object.

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