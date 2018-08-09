// @flow

import fs from 'fs'
import {promisify} from 'util'

import _mkdirp from 'mkdirp'
import _rimraf from 'rimraf'

export const mkdirp = promisify(_mkdirp)

export const rimraf = promisify(_rimraf)

export const readFile = promisify(fs.readFile)

export const writeFile = promisify(fs.writeFile)

export function fileExists (filePath: string) {
  return new Promise(resolve => {
    fs.access(filePath, fs.constants.F_OK, err => {
      resolve(!err)
    })
  })
}
