'use strict'

const ok = require('assert')
const ex = require('../vm')
const Scope = require('../scope')

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
    ok.deepEqual(ex('[ ]').toJS(), [])
    ok.deepEqual(ex('[ [ 1  ] ]').toJS(), [[1]])
    ok.deepEqual(ex('[ [ ] ]').toJS(), [[]])
  })
  it('does conditions', () => {
    ok.deepEqual(ex('(if (< 2 3) 1 2)'), 1)
    ok.deepEqual(ex('(if (> 2 3) 1 2)'), 2)
    ok.equal(ex('(if (< 3 2) 1)'), null)
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
  it('reports missing functions', () => {
    ok.throws(() => ex(['nofunc']),
      `Function not found: nofunc`)
  })
  it('calls functions', () => {
    Scope.current = Scope({ variables: { x: (x, y) => x + y}})
    ok.deepEqual(
      ex(['x', ['number', 2 ], ['number', 4]]),
      6
    )
  })
})
