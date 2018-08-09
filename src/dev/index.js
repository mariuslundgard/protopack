// @flow

import chalk from 'chalk'
import chokidar from 'chokidar'
import express from 'express'
import path from 'path'
import buildAll from '../build/buildAll'
import readConfigArr from '../lib/readConfigArr'

import type {$Request, $Response, NextFunction} from 'express'

type Opts = {
  baseUrl: string,
  cwd: string,
  port?: number
}

async function dev (opts: Opts) {
  const port = opts.port || 8080

  opts.baseUrl = `http://localhost:${port}`

  let configArr
  let watcher
  let results = []

  function watch () {
    const watchedPaths = results
      .filter(result => Boolean(result.input))
      .map(config => config.input.path)

    watcher = chokidar.watch(watchedPaths, {
      ignoreInitial: true
    })

    watcher.on('all', async (...args) => {
      try {
        configArr = await readConfigArr({baseUrl: opts.baseUrl, cwd: opts.cwd})
        ;[results] = await buildAll(configArr)
        results.forEach(result => {
          console.log(
            'rebuilt',
            chalk.green(path.relative(process.cwd(), result.output.path))
          )
        })
        unwatch()
        watch()
      } catch (err) {
        console.error(err)
      }
    })
  }

  function unwatch () {
    watcher.close()
  }

  try {
    configArr = await readConfigArr({baseUrl: opts.baseUrl, cwd: opts.cwd})
    ;[results] = await buildAll(configArr)
    // console.log(results)
    results.forEach(result => {
      console.log(
        'built',
        chalk.green(path.relative(process.cwd(), result.output.path))
      )
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  const app = express()

  app.use((req: $Request, res: $Response, next: NextFunction) => {
    console.log(req.method, req.url)
    next()
  })

  app.use(express.static(results[0].output.basePath))

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

export default dev
