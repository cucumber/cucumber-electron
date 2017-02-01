const electron = require('electron')
const remoteConsole = electron.remote.getGlobal('console')
const util = require('util')

const localConsole = console

global.console = {}

function ipcSafe(arg) {
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
  }else if (typeof arg === 'object') {
    return '{ ' +
      Object.keys(arg).map(key => `${key}: ${ipcSafe(arg[key])}`).join(', ') +
    ' }'
  } else if (typeof arg === 'string') {
    return arg
  }
  return util.inspect(arg, null, false)
}

['error', 'warn', 'info', 'log'].forEach(method => {
  global.console[method] = function () {
    const args = Array.prototype.slice.apply(arguments)
    localConsole[method].apply(localConsole, args)
    remoteConsole[method].apply(remoteConsole, args.map(arg => ipcSafe(arg)))
  }
})

Object.keys(localConsole).filter(m => typeof localConsole[m] == 'function')
  .forEach(nativeMethod => {
    global.console[nativeMethod] = global.console[nativeMethod] ||
      localConsole[nativeMethod].bind(localConsole)
  })
