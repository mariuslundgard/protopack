'use strict'

const builders = {
  css: require('./css'),
  html: require('./html'),
  js: require('./js')
}

async function buildAll (configArr) {
  return Promise.all(
    configArr.map(config => {
      if (!builders[config.type]) {
        throw new Error(`No builder for type: ${config.type}`)
      }

      return builders[config.type](config, buildAll)
    })
  )
}

module.exports = buildAll
