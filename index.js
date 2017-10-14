#!/usr/bin/env node

const fs = require('fs')
const parse = require('./parse')
const execute = require('./vm')

const [_, __, filename] = process.argv

const code = parse(fs.readFileSync(filename) + '')

execute(code)
