// @flow

import path from 'path'
import {fileExists, readFile} from './fs'

async function findConfig (basePath: string) {
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

export default findConfig
