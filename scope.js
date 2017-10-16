'use strict'

function Scope ({ variables } = {}) {
  if (!(this instanceof Scope)) {
    return new Scope(...arguments)
  }
  this.variables = variables || {}
  this.stack = []
}

Scope.prototype = {
  constructor: Scope,
  let(name, value) {
    this.variables[name] = value
  },
  enter() {
    this.stack.push(Object.create(this.variables))
    this.variables = this.stack[this.stack.length - 1]
  },
  exit() {
    this.stack[this.stack.length - 2] = this.stack[this.stack.length - 1]
  },
  wrap(fn) {
    return (...args) => {
      this.enter()
      try {
        return fn(...args)
      } finally {
        this.exit()
      }
    }
  }
}

module.exports = Scope
