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
import path from 'path'
import {build} from 'protopack'

const opts = {
  cwd: path.resolve(__dirname, '..'),
  baseUrl: 'http://localhost:3000'
}

build(opts)
  .then(results => {
    console.log('Built ok')
  })
  .catch(err => {
    console.error(err)
  })
```

### Express middleware

```js
import express from 'express'
import path from 'path'
import {middleware} from 'protopack'

const app = express()

const opts = {
  cwd: path.resolve(__dirname, '..'),
  baseUrl: 'http://localhost:3000'
}

// Use the middleware before routes
app.use(middleware(opts))

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000')
})
```

## TODO

- [ ] Support images
- [x] Support inline styles/scripts (via [`inline-source`](https://github.com/popeindustries/inline-source#readme)?)
- [ ] Hot-reloading
- [ ] Support custom `babel` presets/plugins
- [ ] Support custom `postcss` plugins
- [ ] Directory listing
- [x] `express` middleware
