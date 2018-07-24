#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const path = require('path')
const argv = require('yargs').argv
const protopack = require('../')
const pkg = require('../package.json')

function printUsage () {
  console.log(`usage: protopack <command> [<args>]

  Commands:
    build
    dev
    start`)
}

async function runCommand () {
  const cmd = argv._[0]

  switch (cmd) {
    case 'build': {
      return protopack.build({cwd: process.cwd()}).then(results => {
        results.forEach(result => {
          console.log(
            'built',
            chalk.green(path.relative(process.cwd(), result.output.path))
          )
        })
      })
    }

    case 'dev': {
      return protopack.dev({cwd: process.cwd()})
    }

    default:
      if (argv.v) {
        // -v
        console.log(`v${pkg.version}`)
      } else if (!cmd) {
        printUsage()
      } else {
        throw new Error(`unknown command: ${cmd}`)
      }
  }
}

runCommand().catch(err => {
  console.log(chalk.red(err.stack))
  process.exit(1)
})
