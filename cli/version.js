const Cucumber = require('@cucumber/cucumber')

const VERSION = require('../package.json').version

const write = process.stdout.write
process.stdout.write = (chunk, ...args) => {
  write.call(process.stdout, `Cucumber.js: ${chunk}Cucumber-electron: ${VERSION}\n`, ...args)
}
new Cucumber.Cli({
  argv: process.argv,
  cwd: process.cwd(),
  stdout: process.stdout
}).run()
