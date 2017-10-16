'use strict'

const ok = require('assert')
const Scope = require('../scope')

describe('scope', () => {
  let scope
  beforeEach(() => {
    scope = Scope()
  })
  it('sets variables', () => {
    scope.let('a', 'b')
    ok.equal(scope.variables.a, 'b')
  })
  it('wraps closures', () => {
    scope.let('a', 'b')
    let executed = false
    scope.wrap(() => {
      executed = true
      ok.equal(scope.variables.a, 'b')
      scope.let('a', 'c')
      ok.equal(scope.variables.a, 'c')
    })()

    ok.equal(scope.variables.a, 'c')
  })
})
