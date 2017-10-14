'use strict'

const assert = require('assert')
const get = require('lodash/get')
const runtypes = require('runtypes')
const { parse } = require('./parse')
const library = require('./library')
const macros = require('./macros')

function getFunction (name) {
  if (/\./.test(name)) {
    return get(global, name)
  }
  if (library[name]) {
    return library[name]
  }
}

function evaluateExpression (expr) {
  if (typeof expr === 'string') {
    return evaluateExpression(parse(expr))
  }
  const [fun, ...args] = expr
  if (macros[fun]) {
    return macros[fun](...args)
  }
  if (library[fun]) {
    return library[fun](...args.map(evaluateExpression))
  }
  const fn = getFunction(fun)
  if (typeof fn != 'function') {
    throw new Error('Function not found: ' + fun)
  }
  return fn(...args.map(evaluateExpression))
  assert(false)
}

module.exports = evaluateExpression
