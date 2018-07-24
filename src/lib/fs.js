'use strict'

const fs = require('fs')
const {promisify} = require('util')

exports.mkdirp = promisify(require('mkdirp'))
exports.rimraf = promisify(require('rimraf'))
exports.readFile = promisify(fs.readFile)
exports.writeFile = promisify(fs.writeFile)
