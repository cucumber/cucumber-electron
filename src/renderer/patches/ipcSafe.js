const util = require('util')

module.exports = function ipcSafe(arg, inspectObjects) {
  if (typeof arg === 'undefined') {
    return '[undefined]'
  } else if (arg === null) {
    return '[null]'
  } else if (arg.nodeType === 1 && typeof arg.tagName === 'string') {
    return `<${arg.tagName.toLowerCase()} />`
  } else if (arg.nodeType === 3 && typeof arg.wholeText === 'string') {
    return `[TextNode: ${arg.wholeText}]`
  } else if (arg instanceof Error) {
    return `[${arg.toString()}]`
  } else if (arg instanceof Date) {
    return `[Date: ${arg.toISOString()}]`
  } else if (Array.isArray(arg)) {
    const array = arg.map(element => ipcSafe(element, inspectObjects))
    return inspectObjects ? '[' + array.join(', ') + ']' : array
  } else if (typeof arg === 'object') {
    if (inspectObjects) {
      return '{ ' +
        Object.keys(arg).map(key => `${key}: ${ipcSafe(arg[key], inspectObjects)}`).join(', ') +
      ' }'
    } else {
      const obj = {}
      Object.keys(arg).forEach(key => {
        obj[key] = ipcSafe(arg[key], inspectObjects)
      })
      return obj
    }
  } else if (typeof arg === 'string') {
    return arg
  }
  return util.inspect(arg, null, false)
}
