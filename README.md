# protopack

**WORK-IN-PROGRESS**. A bundler for prototypes.

```sh
npm install protopack --save-dev
```

## Documentation

`protopack` is built on top of `rollup`, `babel`, `postcss` and many other libraries.

### Get started

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

### Node.js API

```js
import {build} from 'protopack'

build({baseUrl: 'http://localhost:3000'})
  .then(results => {
    console.log('Built ok')
  })
  .catch(err => {
    console.error(err)
  })
```

### Express middleware (TODO)

```js
import express from 'express'
import {expressMiddleware} from 'protopack'

const app = express()

// Use the middleware before routes
app.use(
  expressMiddleware({
    baseUrl: 'http://localhost:3000'
  })
)

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000')
})
```

## TODO

- [ ] Support images
- [ ] Support inline styles/scripts (via [`inline-source`](https://github.com/popeindustries/inline-source#readme)?)
- [ ] Hot-reloading
- [ ] Support custom `babel` presets/plugins
- [ ] Support custom `postcss` plugins
- [ ] Directory listing
- [ ] `express` middleware
