const originalProcessType = process.type
try {
  process.type = 'cucumber-electron'
  require('debug')
} catch (e) {
  // no dependency on debug module
}
process.type = originalProcessType
