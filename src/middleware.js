// @flow

import path from 'path'
import build from './build'
import {readFile} from './lib/fs'

import type {$Request, $Response, NextFunction} from 'express'
import type {BuildOpts} from './types'

const mimeTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  'js.map': 'application/json',
  'css.map': 'application/json'
}

function middleware (opts: BuildOpts) {
  let _results
  let paths = []

  const clients = []

  build(opts).then(results => {
    _results = results
    paths = results.map(
      r => '/' + path.relative(r.output.basePath, r.output.path)
    )
  })

  return async (req: $Request, res: $Response, next: NextFunction) => {
    if (req.path === '/protopack/dev.js') {
      res.set('Content-Type', 'application/json')
      res.send(`'use strict';
var es = new EventSource('/protopack/events');
console.log(es)
`)
      return
    }

    if (req.path === '/protopack/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      })

      clients.push(res)

      res.write('event: @@protopack/INIT\n')
      res.write('data: {}\n\n')

      req.on('close', () => {
        const idx = clients.indexOf(res)

        if (idx > -1) {
          clients.splice(idx, 1)
        }
      })

      return
    }

    const p = req.path === '/' ? '/index.html' : req.path
    const idx = paths.indexOf(p)

    if (idx > -1) {
      const resource = _results[idx]
      const buf = await readFile(resource.output.path)
      res.set('Content-Type', mimeTypes[resource.type] || 'text/plain')
      if (resource.type === 'html') {
        res.send(
          buf
            .toString()
            .replace(
              '</body>',
              '  <script src="/protopack/dev.js"></script>\n  </body>'
            )
        )
      } else {
        res.send(buf)
      }
    } else {
      next()
    }
  }
}

export default middleware
