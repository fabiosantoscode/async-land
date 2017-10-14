const lib = exports

exports.foreach = (...args) => args.length === 2 ? [].forEach.call(args[1], args[0]) :
  (lib.foreach(args[0], args[args.length - 2]), lib.foreach(...args.slice(1)))
exports['<'] = (a, b) => a < b
exports['>'] = (a, b) => a > b
