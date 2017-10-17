'use strict'

const assert = require('assert')
const get = require('lodash/get')
const runtypes = require('runtypes')
const { parse } = require('./parse')
const library = require('./library')
const macros = require('./macros')
const Scope = require('./scope')

function getFunction (name) {
  if (typeof name === 'function') return name
  if (library[name]) {
    return library[name]
  }
}

function evalFun (expr) {
  if (typeof expr === 'string' && Scope.current.variables[expr]) return Scope.current.variables[expr]
  if (typeof expr === 'string' || typeof expr === 'function') return expr
  return evaluateExpression(expr)
}

function evaluateExpression (expr) {
  if (typeof expr === 'string') {
    if (Scope.current.variables[expr]) {
      return Scope.current.variables[expr]
    }
    /* istanbul ignore next */
    throw new Error(expr + ' could not be evaluated')
  }
  /* istanbul ignore next */
  if (global.ASYNCLAND_VERBOSE) {
    console.log('evaluateExpression', expr)
  }
  assert(Array.isArray(expr), 'trying to eval non-array')
  let [fun, ...args] = expr
  fun = evalFun(fun)
  if (typeof fun == 'string' && macros[fun]) {
    return macros[fun](...args)
  }
  if (
    typeof fun == 'string' &&
    (fun in Scope.current.variables)
  ) {
    fun = Scope.current.variables[fun]
  }
  const fn = getFunction(fun)
  if (typeof fn != 'function') {
    throw new Error('Function not found: ' + fun)
  }
  return fn(...args.map(evaluateExpression))
}

function clean (expr) {
  return expr.map(exprIn => typeof exprIn === 'number' ? ['number', exprIn] : exprIn)
}

module.exports = (expr, scope) => (
typeof expr === 'string'
  ? evaluateExpression(parse(expr))
  : evaluateExpression(expr)
)
