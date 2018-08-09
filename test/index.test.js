'use strict'

const path = require('path')
const protopack = require('../src')
const {fileExistsOrThrow, readFileToString, rimraf} = require('./helpers')

const fixtures = path.resolve(__dirname, 'fixtures')

describe('protopack', () => {
  it('should execute build command', async () => {
    await rimraf(path.resolve(fixtures, 'foo/dist'))

    const opts = {
      cwd: path.resolve(fixtures, 'foo')
    }

    await protopack.build(opts)
  })

  it('should output built files', async () => {
    await rimraf(path.resolve(fixtures, 'foo/dist'))

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
    await rimraf(path.resolve(fixtures, 'foo/dist'))

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

  it('should output names', async () => {
    await rimraf(path.resolve(fixtures, 'output-names/dist'))

    const opts = {
      cwd: path.resolve(fixtures, 'output-names')
    }

    const results = await protopack.build(opts)

    expect(results[0].output.path.endsWith('/widget.html')).toBe(true)
    expect(results[1].output.path.endsWith('/widget.js')).toBe(true)

    const js = await readFileToString(results[1].output.path)

    expect(js).toEqual(
      `console.log('foo');\n//# sourceMappingURL=widget.js.map\n`
    )
  })

  it('should install missing npm modules', async () => {
    await rimraf(path.resolve(fixtures, 'install-npm-modules/dist'))
    await rimraf(path.resolve(fixtures, 'install-npm-modules/node_modules'))
    await rimraf(
      path.resolve(fixtures, 'install-npm-modules/package-lock.json')
    )

    const opts = {
      cwd: path.resolve(fixtures, 'install-npm-modules')
    }

    await protopack.build(opts)

    // expect node_modules/preact to now exist
    await fileExistsOrThrow(
      path.resolve(fixtures, 'install-npm-modules/node_modules/preact')
    )
  })
})
