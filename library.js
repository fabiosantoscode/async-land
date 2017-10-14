const lib = exports

exports.map = (list, fn) => list.map(fn)
exports.forEach = (list, fn) => list.forEach(fn)
exports['<'] = (a, b) => a < b
exports['>'] = (a, b) => a > b
exports['+'] = (a, b) => a.concat ? a.concat(b) : a + b
exports['-'] = (a, b) => a.remove ? a.remove(b) : a - b
exports['=='] = (a, b) => a.equals ? a.equals(b) : a === b
