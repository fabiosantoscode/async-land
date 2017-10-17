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
  return Scope.current.get(name)
}

function evalFun (expr) {
  if (typeof expr === 'string' || typeof expr === 'function') return expr
  return evaluateExpression(expr, INTERNAL_CALL)
}

const USER_CALL = Symbol()
const INTERNAL_CALL = Symbol()
function evaluateExpression (expr, scope = USER_CALL) {
  if (typeof expr === 'string' && scope == USER_CALL) {
    return evaluateExpression(parse(expr), INTERNAL_CALL)
  }
  if (typeof expr === 'string') {
    if (Scope.current.variables[expr]) {
      return Scope.current.variables[expr]
    }
    throw new Error(expr + ' could not be evaluated')
  }
  if (scope == 'vv') {
    console.log('evaluateExpression', expr)
  }
  assert(Array.isArray(expr), 'trying to eval non-array')
  let [fun, ...args] = expr
  fun = evalFun(fun)
  return evalCall(fun, ...args)
}

function evalCall (fun, ...args) {
  const evalAry = args => args.map(arg => evaluateExpression(arg, INTERNAL_CALL))
  if (typeof fun == 'string' && macros[fun]) {
    return macros[fun](...args)
  }
  const fn = getFunction(fun)
  if (typeof fn != 'function') {
    throw new Error('Function not found: ' + fun)
  }
  return fn(...evalAry(args))
}

module.exports = evaluateExpression
