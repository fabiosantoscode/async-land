'use strict'

const ok = require('assert')
const ex = require('../vm')

describe('jslisp', () => {
  it('processes strings, numbers', () => {
    ok.equal(
      ex('"foo"'),
      'foo'
    )
    ok.equal(
      ex('3'),
      3
    )
  })
  it('can eval lists', () => {
    ok.deepEqual(ex('[]').toJS(), [])
    ok.deepEqual(ex('[[1]]').toJS(), [[1]])
    ok.deepEqual(ex('[[]]').toJS(), [[]])
  })
  it('does conditions', () => {
    ok.deepEqual(ex('(if (< 2 3) 1 2)'), 1)
  })
})
