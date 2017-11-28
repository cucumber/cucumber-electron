const ipcSafe = require('./ipcSafe')

function debugInDependencies() {
  try {
    require('debug')
    return true
  } catch (e) {
    return false
  }
}

function patchDebug() {
  const originalDebug = require('debug')
  const cacheKey = Object.keys(require.cache).find(key => require.cache[key].exports == originalDebug)
  const mainProcessDebug = require('electron').remote.getGlobal('mainProcessDebug')

  require.cache[cacheKey].exports = namespaces => {
    return (...args) => {
      mainProcessDebug({ namespaces, args: ipcSafe(args, false) })
    }
  }
}

if (debugInDependencies()) {
  patchDebug()
}
