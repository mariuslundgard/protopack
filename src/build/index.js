'use strict'

const path = require('path')
const fs = require('../lib/fs')
const readConfigArr = require('../lib/readConfigArr')
const buildAll = require('./buildAll')

async function build (opts = {}) {
  const configArr = await readConfigArr(opts)

  // Clean up
  await Promise.all(
    configArr.map(config => fs.rimraf(path.dirname(config.output)))
  )

  return buildAll(configArr).then(resultsArr =>
    resultsArr.reduce((arr, results) => arr.concat(results))
  )
}

module.exports = build
