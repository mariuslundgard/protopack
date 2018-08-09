// @flow

import findConfig from './findConfig'
import parseConfig from './parseConfig'

import type {BuildOpts} from '../types'

async function readConfigArr (opts: BuildOpts) {
  if (!opts.cwd) {
    throw new Error(`Missing "cwd" option`)
  }

  const config = await findConfig(opts.cwd)

  return parseConfig(config, opts)
}

export default readConfigArr
