'use strict'

const postcss = require('postcss')
const fs = require('../../lib/fs')

// postcss plugins
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcssCustomProperties = require('postcss-custom-properties')
const postcssImport = require('postcss-import')
const postcssNesting = require('postcss-nesting')

async function buildCss (config) {
  const buf = await fs.readFile(config.input)

  const plugins = [
    postcssImport,
    postcssNesting,
    postcssCustomProperties(),
    autoprefixer,
    process.env.NODE_ENV === 'production' && cssnano
  ].filter(Boolean)

  const result = await postcss(plugins).process(buf, {
    from: config.input,
    to: config.output,
    map: {inline: false}
  })

  await fs.writeFile(config.output, result.css)

  if (result.map) {
    await fs.writeFile(config.output + '.map', result.map)
  }

  return [
    {
      type: 'css',
      input: {
        path: config.input
      },
      output: {
        path: config.output
      }
    },
    {
      type: 'css.map',
      input: null,
      output: {
        path: config.output + '.map'
      }
    }
  ]
}

module.exports = buildCss
