# protopack

**WORK-IN-PROGRESS**. A bundler for prototypes.

```sh
npm install protopack --save-dev
```

## Documentation

Create a new directory for a prototype. Add a file called `.protopack.config.js` (or `protopack.json`):

```js
// .protopack.config.js
'use strict'

module.exports = {
  input: './src/index.html',
  output: './dist/index.html'
}
```

Create a new directory called `src`, and add an `index.html` file to it.

Then call:

```sh
NODE_ENV=production npx protopack build
```
