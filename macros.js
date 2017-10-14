'use strict'

const ex = () => require('./vm')
const Immutable = require('immutable')

const mac = module.exports
mac.string = str => str
mac.number = n => n
mac.list = (...items) => Immutable.List.of(...items.map(ex()))

mac.do = (...args) => args.reduce((accum, val) => ex()(val), null)
mac.if = (cond, therefore, otherwise) => ex()(cond) ? ex()(therefore) : otherwise ? ex()(otherwise) : null
