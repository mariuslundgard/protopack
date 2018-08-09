// @flow

import path from 'path'

import type {BuildOpts, BuildConfig, BuildEntry} from '../types'

function parseConfig (
  configArr: BuildConfig | BuildConfig[],
  opts: BuildOpts
): BuildEntry[] {
  configArr = Array.isArray(configArr) ? configArr : [configArr]

  return configArr.map(config => {
    if (typeof config.input !== 'string') {
      throw new Error('The "input" parameter must be a string')
    }

    if (typeof config.output !== 'string') {
      throw new Error('The "output" parameter must be a string')
    }

    const pathinfo = path.parse(config.input)
    const inputPath = path.resolve(opts.cwd, config.input)
    const outputPath = path.resolve(opts.cwd, config.output)

    const input = {
      basePath: path.dirname(inputPath),
      dirPath: path.dirname(inputPath),
      path: inputPath
    }

    const output = {
      basePath: path.dirname(outputPath),
      dirPath: path.dirname(outputPath),
      path: outputPath
    }

    switch (pathinfo.ext) {
      case '.css':
        return {
          type: 'css',
          input,
          output,
          baseUrl: opts.baseUrl
        }

      case '.html':
        return {
          type: 'html',
          input,
          output,
          baseUrl: opts.baseUrl
        }

      case '.js':
        return {
          type: 'js',
          input,
          output,
          baseUrl: opts.baseUrl
        }

      default:
        throw new Error(`Unsupported extension: ${pathinfo.ext}`)
    }
  })
}

export default parseConfig
