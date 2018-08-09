// @flow

import {rimraf} from '../lib/fs'
import readConfigArr from '../lib/readConfigArr'
import buildAll from './buildAll'

import type {BuildOpts} from '../types'

async function build (opts: BuildOpts) {
  const configArr = await readConfigArr(opts)

  // Clean up
  await Promise.all(configArr.map(config => rimraf(config.output.basePath)))

  return buildAll(configArr).then(resultsArr =>
    resultsArr.reduce((acc, x) => acc.concat(x), [])
  )
}

export default build
