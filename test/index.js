'use strict'

const ok = require('assert')
const parse = require('../parse')
const tokenise = parse.tokenise
const ex = require('../vm')

describe('parser', () => {
  it('tokenises programs', () => {
    ok.deepEqual(tokenise('{ x: 3 }'), [ '}', [ 'number', '3' ], ':', 'x', '{' ])
    ok.deepEqual(tokenise('(fn)'), [ ')', 'fn', '(' ])
    ok.deepEqual(tokenise('[3]'), [ ']', [ 'number', 3 ], '[' ])
    ok.deepEqual(tokenise('(fn) [3]'), [ ']', [ 'number', 3 ], '[', ')', 'fn', '(' ])
    ok.deepEqual(tokenise('"foo"'), [ [ 'string', 'foo' ] ])
  })
  it('parses strings, numbers, lists and maps', () => {
    ok.deepEqual(parse('[3]'), [ 'list', [ 'number', 3 ] ])
    ok.deepEqual(parse('3'), [ 'number', 3 ])
    ok.deepEqual(parse('"3"'), [ 'string', 3 ])
    ok.deepEqual(
      parse('{ foo: 3, bar: ["baz"], qux: "qux" }'),
      [
        'object',
        [ 'foo', [ 'number', 3 ] ],
        [ 'bar', ['list', ['string', 'baz' ] ] ],
        [ 'qux', ['string', 'qux' ] ]
      ]
    )
    ok.deepEqual(parse('3 3'), [
      'do',
      [ 'number', 3 ],
      [ 'number', 3 ]
    ])
  })
  it('parses lists', () => {
    ok.deepEqual(
      parse('[]'),
      ['list']
    )
    ok.deepEqual(
      parse('[[]]'),
      ['list', ['list']]
    )
    ok.deepEqual(
      parse('[[1]]'),
      ['list', ['list', ['number', 1]]]
    )
  })
})

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
  it('does conditions')
})
