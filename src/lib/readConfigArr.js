'use strict'

const fs = require('fs')
const path = require('path')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)

function parseConfig (configArr, opts) {
  configArr = Array.isArray(configArr) ? configArr : [configArr]

  return configArr.map(config => {
    if (typeof config.input !== 'string') {
      throw new Error('The "input" parameter must be a string')
    }

    if (typeof config.output !== 'string') {
      throw new Error('The "output" parameter must be a string')
    }

    const pathinfo = path.parse(config.input)
    const input = path.resolve(opts.cwd, config.input)
    const basePath = path.dirname(input)

    switch (pathinfo.ext) {
      case '.css':
        return {
          type: 'css',
          input,
          output: path.resolve(opts.cwd, config.output),
          basePath,
          dirPath: path.dirname(input),
          baseUrl: opts.baseUrl
        }

      case '.html':
        return {
          type: 'html',
          input,
          output: path.resolve(opts.cwd, config.output),
          basePath,
          dirPath: path.dirname(input),
          baseUrl: opts.baseUrl
        }

      case '.js':
        return {
          type: 'js',
          input,
          output: path.resolve(opts.cwd, config.output),
          basePath,
          dirPath: path.dirname(input),
          baseUrl: opts.baseUrl
        }

      default:
        throw new Error(`Unsupported extension: ${pathinfo.ext}`)
    }
  })
}

function fileExists (filePath) {
  return new Promise(resolve => {
    fs.exists(filePath, resolve)
  })
}

async function findConfig (basePath) {
  const jsExists = await fileExists(
    path.resolve(basePath, '.protopack.config.js')
  )

  const jsonExists = await fileExists(path.resolve(basePath, 'protopack.json'))

  if (!jsExists && !jsonExists) {
    throw new Error('Missing config file')
  }

  if (jsExists) {
    return require(path.resolve(basePath, '.protopack.config.js'))
  }

  const buf = await readFile(path.resolve(basePath, 'protopack.json'))

  return JSON.parse(buf.toString())
}

async function readConfigArr (opts) {
  if (!opts.cwd) {
    throw new Error(`Missing "cwd" option`)
  }

  const config = await findConfig(opts.cwd)

  return parseConfig(config, opts)
}

module.exports = readConfigArr
