'use strict'

const assert = require('assert')
const events = require('events')
const runtypes = require('runtypes')

const rFunction = /[a-zA-Z+\-*\/#\.<>]+/
const rNumberStart = /[0-9]/
const rNumber = /[0-9\.]/
const rWhitespace = /\s/

function tokenise (code) {
  var out = []

  for (var i = 0; i < code.length; i++) {
    const char = code[i]
    if (rWhitespace.test(char)) { continue }
    if ('()[]{}:,#'.indexOf(char) != -1) { out.push(char); continue }
    if ('"\''.indexOf(char) !== -1) {
      let str = ''
      while ('"\''.indexOf(code[++i]) === -1) {
        str += code[i]
      }
      out.push(['string', str])
      continue
    }
    if ('"'.indexOf(char) !== -1) {
      let str = ''
      while ('"'.indexOf(code[++i]) === -1) {
        str += code[i]
      }
      out.push(['string', str])
      continue
    }
    if (rNumberStart.test(char)) {
      let num = code[i]
      while (rNumber.test(code[++i])) {
        num += code[i]
      }
      out.push(['number', JSON.parse(num)])
      i--
      continue
    }
    if (rFunction.test(char)) {
      let str = code[i]
      while(rFunction.test(code[++i])) {
        str += code[i]
      }
      out.push(str)
      i--
      continue
    }
    throw new Error('Invalid character ' + JSON.stringify(code[i]))
  }

  return out.reverse()
}

function parseExpression (tokens, depth = 0) {
  function peek (n = 1) {
    const peeked = tokens[tokens.length - n]
    if (peeked == null) {
      assert(false, 'end of file')
    }
    return peeked
  }

  function consume (tok = null) {
    const consumed = tokens.pop()
    if (tok != null) {
      assert.equal(consumed, tok)
    }
    return consumed
  }

  if (Array.isArray(peek())) {
    return consume()
  }

  if (peek() === '[') {
    consume('[')

    const list = ['list']
    while (peek() !== ']') {
      list.push(parseExpression(tokens, depth + 1))
    }

    consume(']')

    return list
  }

  if (peek() === '{') {
    consume('{')

    const object = ['object']
    while (peek() !== '}') {
      object.push(
        [
          parseExpression(tokens, depth + 1),
          (consume(':'), parseExpression(tokens, depth + 1))
        ]
      )
      if (peek() == ',') { consume() }
    }
    consume('}')
    return object
  }

  if (peek() === '(') {
    consume('(')

    let args = []
    while (peek() != ')') {
      if (peek() == '(') {
        args.push(parseExpression(tokens, depth + 1))
        continue
      }
      args.push(consume())
    }

    consume(')')

    return args
  }

  if (typeof peek() === 'string') {
    return consume()
  }

  return args
}

module.exports = function parse (code) {
  const tokens = tokenise(code)

  function peek (n = 0) {
    return tokens[tokens.length - n]
  }

  function consume (tok = null) {
    const current = tokens.pop()
    if (tok != null && tok != current) {
      throw new Error('Unexpected ' + current + ' expected ' + tok)
    }
    return current
  }

  const out = []
  while (tokens.length) {
    out.push(parseExpression(tokens))
  }

  if (out.length != 1) {
    return ['do', ...out]
  }

  return out[0]
}

Object.assign(module.exports, { tokenise})
