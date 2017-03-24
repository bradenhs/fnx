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