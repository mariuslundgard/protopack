// @flow

import postcss from 'postcss'
import {readFile, writeFile} from '../../lib/fs'

// postcss plugins
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssImport from 'postcss-import'
import postcssNesting from 'postcss-nesting'

import type {BuildEntry} from '../../types'

async function buildCss (config: BuildEntry) {
  const buf = await readFile(config.input.path)

  const plugins = [
    postcssImport,
    postcssNesting,
    postcssCustomProperties(),
    autoprefixer,
    process.env.NODE_ENV === 'production' && cssnano
  ].filter(Boolean)

  const result = await postcss(plugins).process(buf, {
    from: config.input.path,
    to: config.output.path,
    map: {inline: false}
  })

  await writeFile(config.output.path, result.css)

  if (result.map) {
    await writeFile(config.output.path + '.map', result.map)
  }

  return [
    {
      type: 'css',
      input: config.input,
      output: config.output
    },
    {
      type: 'css.map',
      input: null,
      output: {
        basePath: config.output.basePath,
        path: config.output.path + '.map'
      }
    }
  ]
}

export default buildCss
