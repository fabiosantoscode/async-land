'use strict'

const ok = require('assert')
const parse = require('../parse')
const tokenise = parse.tokenise

describe('parser', () => {
  it('tokenises programs', () => {
    ok.deepEqual(tokenise('{ x: 3 }'), [ '}', [ 'number', '3' ], ':', 'x', '{' ])
    ok.deepEqual(tokenise('(fn)'), [ ')', 'fn', '(' ])
    ok.deepEqual(tokenise('[3]'), [ ']', [ 'number', 3 ], '[' ])
    ok.deepEqual(tokenise('(fn) [3]'), [ ']', [ 'number', 3 ], '[', ')', 'fn', '(' ])
    ok.deepEqual(tokenise('"foo"'), [ [ 'string', 'foo' ] ])
    ok.deepEqual(tokenise('(())'), [')', ')', '(', '('])
    ok.deepEqual(
      tokenise(
        `(let x "world"
           # comments are ignored
           (console.log "hello" x))`
      ).reverse(),
      ['(', 'let', 'x', ['string', 'world'], '(', 'console.log', ['string', 'hello'], 'x', ')', ')'])
  })
  it('parses strings, numbers, lists and maps', () => {
    ok.deepEqual(parse('[3]'), [ 'list', [ 'number', 3 ] ])
    ok.deepEqual(parse('3'), [ 'number', 3 ])
    ok.deepEqual(parse('"3"'), [ 'string', '3' ])
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
  it('parses conditions', () => {
    ok.deepEqual(
      parse('(if (< 2 3) 1 2)'),
      ['if', ['<', ['number', 2], ['number', 3]], ['number', 1], ['number', 2]]
    )
  })
  it('parses strings', () => {
    ok.deepEqual(
      parse('"foo"'),
      ['string', 'foo']
    )
  })
  it('parses nested fcalls', () => {
    ok.deepEqual(
      parse(`(let x "world"
        # comments are ignored
        (console.log "hello" x))`),
      ['let', 'x', ['string', 'world'], ['console.log', ['string', 'hello'], 'x']]
    )
  })
  it('parses uplevel notation', () => {
    ok.deepEqual(
      parse('(:let y 6) (+ 1 x) (+ 2 x)'),
      [ 'let', 'y', ['number', 6], ['do', [ '+', [ 'number', 1 ], 'x' ], [ '+', [ 'number', 2 ], 'x' ]]]
    )
    ok.deepEqual(
      parse('(+ x x) (:let x 2)'),
      [
        'do',
        ['+', 'x', 'x'],
        ['let', 'x', ['number', 2]]
      ]
    )
  })
})
