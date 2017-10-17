const lib = exports

exports.map = (list, fn) => list.map(fn)
exports.forEach = (list, fn) => list.forEach(fn)
exports.identity = () => x => x

const operators = ['<>+-*/|', '=='].reduce((accum, char) => typeof char === 'string' ? accum.concat(char.split('')) : accum.concat(char),[])

for (const op of operators) {
  exports[op] = eval(`
    (...args) => args.reduce((a, b) => a ${op} b)
  `)
}
