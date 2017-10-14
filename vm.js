'use strict'

const assert = require('assert')
const get = require('lodash/get')
const runtypes = require('runtypes')
const parse = require('./parse')
const library = require('./library')
const macros = require('./macros')

function getFunction (name) {
  if (/\./.test(name)) {
    const [root, names] = name.split('.', 1)
    runtypes.String.check(root)
    runtypes.String.check(names)
    return get(global[root], names)
  }
  if (library[name]) {
    return library[name]
  }
}

function evaluateExpression (expr) {
  if (typeof expr === 'string') {
    return evaluateExpression(parse(expr))
  }
  if (macros[expr[0]]) {
    return macros[expr[0]](...expr.slice(1))
  }
  if (library[expr[0]]) {
    return library[expr[0]](...expr.slice(1).map(evaluateExpression))
  }
  assert(false)
}

module.exports = evaluateExpression
