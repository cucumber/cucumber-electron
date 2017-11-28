const electron = require('electron')

if ('DEBUG' in electron.remote.process.env) {
  const originalProcessType = process.type
  try {
    process.type = 'cucumber-electron'
    require('debug')
  } catch (e) {
    process.type = originalProcessType
  }
}
