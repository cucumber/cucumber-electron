require('./patches/gherkin')
require('./keyboard/bindings')

const electron = require('electron')
const Cucumber = require('cucumber')

const Options = require('../cli/options')
const Output = require('./output')

const output = new Output()
const options = new Options(electron.remote.process.argv)

process.on('unhandledRejection', function(reason) {
  output.write(reason.message + "\n" + reason.stack)
  exitWithCode(3)
})

function exitWithCode(code) {
  if (options.electronDebug) return
  electron.remote.process.exit(code)
}

try {
  const argv = options.cucumberArgv
  const cwd = process.cwd()
  const stdout = new Output()
  new Cucumber.Cli({ argv, cwd, stdout }).run()
    .then(pass => exitWithCode(pass ? 0 : 1))
} catch (err) {
  log(err.stack)
  exitWithCode(2)
}
