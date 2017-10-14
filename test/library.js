'use strict'

const ok = require('assert')
const immutable = require('immutable')
const lib = require('../library')

describe('library', () => {
  it('map', () => {
    ok.deepEqual(lib.map(immutable.List.of(2, 3), (x) => x - 1), immutable.List.of(1, 2))
  })
  it('<', () => {
    ok.equal(lib['<'](1, 2), true)
    ok.equal(lib['<'](2, 1), false)
  })
  it('>', () => {
    ok.equal(lib['>'](2, 1), true)
    ok.equal(lib['>'](1, 2), false)
  })
})
