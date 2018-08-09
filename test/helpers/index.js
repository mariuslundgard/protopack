'use strict'

const fs = require('fs')
const {promisify} = require('util')

const rimraf = promisify(require('rimraf'))
const readFile = promisify(fs.readFile)

function fileExistsOrThrow (filepath) {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function readFileToString (filepath) {
  const buf = await readFile(filepath)
  return buf.toString()
}

module.exports = {
  fileExistsOrThrow,
  readFileToString,
  rimraf
}
