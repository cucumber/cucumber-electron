const runCli = require('./run')

const VERSION = require('../../package.json').version
const rewriteVersion = (originalVersion) =>
  originalVersion.trim().length > 0 ?
    `Cucumber.js: ${originalVersion}\nCucumber-electron: ${VERSION}` : ''

runCli(rewriteVersion)