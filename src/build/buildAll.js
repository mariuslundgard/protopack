// @flow

import cssBuilder from './css'
import htmlBuilder from './html'
import jsBuilder from './js'

import type {BuildEntry} from '../types'

const builders = {
  css: cssBuilder,
  html: htmlBuilder,
  js: jsBuilder
}

async function buildAll (configArr: BuildEntry[]) {
  return Promise.all(
    configArr.map(config => {
      if (!builders[config.type]) {
        throw new Error(`No builder for type: ${config.type}`)
      }

      return builders[config.type](config, buildAll)
    })
  )
}

export default buildAll
