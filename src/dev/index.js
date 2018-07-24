'use strict'

const chalk = require('chalk')
const chokidar = require('chokidar')
const express = require('express')
const path = require('path')
const buildAll = require('../build/buildAll')
const readConfigArr = require('../lib/readConfigArr')

async function dev (opts = {}) {
  const port = opts.port || 8080

  opts.baseUrl = `http://localhost:${port}`

  let configArr = await readConfigArr(opts)
  let watcher
  let results

  function build () {
    return buildAll(configArr)
  }

  function watch () {
    const watchedPaths = results
      .filter(result => Boolean(result.input))
      .map(config => config.input.path)

    watcher = chokidar.watch(watchedPaths, {
      ignoreInitial: true
    })

    watcher.on('all', async (...args) => {
      configArr = await readConfigArr(opts)
      ;[results] = await build()
      results.forEach(result => {
        console.log(
          'rebuilt',
          chalk.green(path.relative(process.cwd(), result.output.path))
        )
      })
      unwatch()
      watch()
    })
  }

  function unwatch () {
    watcher.close()
  }

  ;[results] = await build()
  results.forEach(result => {
    console.log(
      'built',
      chalk.green(path.relative(process.cwd(), result.output.path))
    )
  })

  const app = express()

  app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
  })

  app.use(express.static(path.dirname(results[0].output.path)))

  app.listen(port, err => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log(`Listening at ${opts.baseUrl}`)
      watch()
    }
  })
}

module.exports = dev
