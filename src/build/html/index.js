'use strict'

const path = require('path')
const fs = require('../../lib/fs')
const compile = require('./compile')
const parse = require('./parse')

async function buildHtml (config, buildAll) {
  const buf = await fs.readFile(config.input)

  const result = parse(buf.toString())

  const output = compile(result.document, config)

  await fs.mkdirp(path.dirname(config.output))

  await fs.writeFile(config.output, output)

  const importConfigArr = result.imports.map(i => {
    const input = path.resolve(path.dirname(config.input), i.input)

    return {
      type: i.type,
      input,
      output: path.resolve(path.dirname(config.output), i.input),
      basePath: config.basePath,
      dirPath: path.dirname(input),
      baseUrl: config.baseUrl
    }
  })

  const imports = await buildAll(importConfigArr)

  return [
    {
      type: 'html',
      input: {
        path: config.input
      },
      output: {
        path: config.output
      }
    },
    ...imports.reduce((x, y) => [...x, ...y], [])
  ]
}

module.exports = buildHtml
