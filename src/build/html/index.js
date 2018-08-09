// @flow

import path from 'path'
import {mkdirp, readFile, writeFile} from '../../lib/fs'
import compile from './compile'
import parse from './parse'

import type {BuildAllFn, BuildEntry, BuildResult} from '../../types'

async function buildHtml (
  config: BuildEntry,
  buildAll: BuildAllFn
): Promise<BuildResult[]> {
  const buf = await readFile(config.input.path)

  const result = parse(buf.toString())

  const output = compile(result.document, config)

  await mkdirp(path.dirname(config.output.path))

  await writeFile(config.output.path, output)

  const importConfigArr = result.imports.map(i => {
    const inputPath = path.resolve(config.input.dirPath, i.input)
    const outputPath = path.resolve(config.output.dirPath, i.input)

    return {
      type: i.type,
      input: {
        basePath: config.input.basePath,
        dirPath: path.dirname(inputPath),
        path: inputPath
      },
      output: {
        basePath: config.output.basePath,
        dirPath: path.dirname(outputPath),
        path: outputPath
      },
      baseUrl: config.baseUrl
    }
  })

  const imports = await buildAll(importConfigArr)

  return imports.reduce((acc, x) => acc.concat(x), [
    {
      type: 'html',
      input: config.input,
      output: config.output
    }
  ])
}

export default buildHtml
