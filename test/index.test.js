'use strict'

const path = require('path')
const protopack = require('../')
const {fileExistsOrThrow, readFileToString} = require('./helpers')

const fixtures = path.resolve(__dirname, 'fixtures')

describe('protopack', () => {
  it('should execute build command', async () => {
    const opts = {
      cwd: path.resolve(fixtures, 'foo')
    }

    await protopack.build(opts)
  })

  it('should output built files', async () => {
    const opts = {
      cwd: path.resolve(fixtures, 'foo')
    }

    const results = await protopack.build(opts)

    expect(results).toHaveLength(6)

    await fileExistsOrThrow(results[0].output.path)
    await fileExistsOrThrow(results[1].output.path)
    await fileExistsOrThrow(results[2].output.path)
    await fileExistsOrThrow(results[3].output.path)
    await fileExistsOrThrow(results[4].output.path)
    await fileExistsOrThrow(results[5].output.path)
  })

  it('should rewrite urls', async () => {
    const opts = {
      cwd: path.resolve(fixtures, 'foo'),
      baseUrl: 'http://localhost:8080'
    }

    const results = await protopack.build(opts)
    const html = await readFileToString(results[0].output.path)

    expect(html).toContain(
      '<script type="module" src="http://localhost:8080/index.js"></script>'
    )
  })
})
