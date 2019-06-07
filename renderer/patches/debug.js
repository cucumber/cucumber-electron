module.exports = function patchDebug({ isTTY }) {
  function debugInDependencies() {
    try {
      require('debug')
      return true
    } catch (e) {
      return false
    }
  }

  if (debugInDependencies()) {
    const originalDebug = require('debug')
    const cacheKey = Object.keys(require.cache).find(
      key => require.cache[key].exports == originalDebug
    )
    const nodeDebug = require('debug/src/node')
    if (!('colors' in nodeDebug.inspectOpts) && isTTY) {
      nodeDebug.inspectOpts.colors = true
    }
    require.cache[cacheKey].exports = nodeDebug
  }
}
