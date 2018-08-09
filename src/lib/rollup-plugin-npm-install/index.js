// @flow

import {exec} from 'child_process'
import path from 'path'
import resolveId from 'resolve'

type Opts = {
  basePath: string
}

function resolveIdAsync (file, opts) {
  return new Promise((resolve, reject) =>
    resolveId(
      file,
      opts,
      (err, contents) => (err ? reject(err) : resolve(contents))
    )
  )
}

function npmInstall (importee: string, opts: Opts) {
  return new Promise((resolve, reject) => {
    exec(`npm install ${importee}`, {cwd: opts.basePath}, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function rollupPluginNpmInstall (opts: Opts) {
  return {
    async resolveId (importee: string, importer: string) {
      // disregard entry module
      if (!importer) return null

      try {
        await resolveIdAsync(importee, {
          basedir: path.dirname(importer)
        })
      } catch (_) {
        // install the module
        await npmInstall(importee, opts)
      }

      return null
    }
  }
}

export default rollupPluginNpmInstall
