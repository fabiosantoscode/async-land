'use strict'

const assert = require('assert')
const Scope = require('./scope')
const ex = () => require('./vm')
const Immutable = require('immutable')

const mac = module.exports
mac.string = str => (assert(typeof str === 'string', str), str)
mac.number = n => (assert(typeof n === 'number', JSON.stringify(n)), n)
mac.list = (...items) => Immutable.List.of(...items.map(ex()))

mac.do = (...args) => args.reduce((accum, val) => ex()(val), null)
mac.if = (cond, therefore, otherwise) => ex()(cond) ? ex()(therefore) : otherwise ? ex()(otherwise) : null
mac.let = (name, value, ...instructions) => Scope.current.wrap(() => (Scope.current.let(name, ex()(value)), mac.do(...instructions))
)()
