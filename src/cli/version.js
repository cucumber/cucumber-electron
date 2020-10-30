const runCli = require('./run')

const VERSION = require('../../package.json').version
const rewriteVersion = (originalVersion) => `Cucumber.js: ${originalVersion}Cucumber-electron: ${VERSION}\n`

runCli(rewriteVersion)