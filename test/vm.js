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
    ok.deepEqual(ex('(if (> 2 3) 1 2)'), 2)
  })
  it('can call functions', () => {
    ok.deepEqual(
      ex([ [
        'identity' ],
        [
          'string',
          'hello'
        ]
      ]),
      'hello'
    )
  })
  it('evals let', () => {
    ok.deepEqual(
      ex(
        [
          'let',
          'x',
          [ 'string', 'world' ],
          ['number', 1]
        ]

      ),
      1
    )
  })
  it('evals let (2)', () => {
    ok.deepEqual(
      ex([ 'let', 'x', ['string', 'world'] ]),
      null
    )
    ok.deepEqual(
      ex([
        'let', 'x', ['string', 'world'],
          ['+', ['string', 'hello'], ['string', ', '], 'x'] ]),
      'hello, world'
    )
  })
})
