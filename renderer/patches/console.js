const ipcSafe = require('./ipcSafe')
const electron = require('electron')
const mainProcessConsole = electron.remote.getGlobal('console')
const localConsole = console
global.console = {};

['error', 'warn', 'info', 'log'].forEach(method => {
  global.console[method] = function () {
    const args = Array.prototype.slice.apply(arguments)
    localConsole[method].apply(localConsole, args)
    mainProcessConsole[method].apply(mainProcessConsole, args.map(arg => ipcSafe(arg, true)))
  }
})

Object.keys(localConsole).filter(m => typeof localConsole[m] == 'function')
  .forEach(nativeMethod => {
    global.console[nativeMethod] = global.console[nativeMethod] ||
      localConsole[nativeMethod].bind(localConsole)
  })
