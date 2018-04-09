const lib = exports

exports.map = (list, fn) => list.map(fn)
exports.forEach = (list, fn) => list.forEach(fn)
exports.identity = () => x => x

const logicalOps = ['<', '>', '==']

for (const op of logicalOps) {
  exports[op] = eval(`
    (...args) => {
      const STOP = Symbol()
      return args.reduce((a, b) => {
        if (a == STOP) {
          return STOP
        }
        if (eval('a ${op} b')) {
          return b
        }
        return STOP
      }) === STOP ? false : true
    }`)
}

const operators = '+-*/|'.split('')

for (const op of operators) {
  exports[op] = eval(`
    (...args) => args.reduce((a, b) => a ${op} b)
  `)
}
