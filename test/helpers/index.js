'use strict'

const fs = require('fs')
const {promisify} = require('util')

const readFile = promisify(fs.readFile)

function fileExistsOrThrow (filepath) {
  return new Promise((resolve, reject) => {
    fs.exists(filepath, result => {
      if (result) return resolve()
      reject(new Error(`File does not exist: ${filepath}`))
    })
  })
}

async function readFileToString (filepath) {
  const buf = await readFile(filepath)
  return buf.toString()
}

module.exports = {
  fileExistsOrThrow,
  readFileToString
}
