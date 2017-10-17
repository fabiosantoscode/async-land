#!/usr/bin/env node

const fs = require('fs')
const parser = require('./parse')
const execute = require('./vm')

const yargs = require('yargs').argv

const { _: [filename, ...applicationArgs], parse, vv } = yargs

const code = parser(fs.readFileSync(filename) + '')

if (parse) {
  console.log(JSON.stringify(code, null, 2))
  process.exit(0)
}

process.argv = process.argv.slice(0, 2).concat(applicationArgs)

if (vv) {
  global.ASYNCLAND_VERBOSE = true
}
execute(code)
