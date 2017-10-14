'use strict'

const ex = () => require('./vm')
const Immutable = require('immutable')

module.exports.do = (...args) => args.reduce((accum, val) => ex()(val), null)
module.exports.if = (cond, therefore, otherwise) => ex()(cond) ? ex()(therefore) : otherwise ? ex()(otherwise) : null
module.exports.string = str => str
module.exports.number = n => n
module.exports.list = (...items) => Immutable.List.of(...items.map(ex()))
