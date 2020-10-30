const Options = require('../cli/options')
const electron = require('electron')
const options = new Options(electron.remote.process.argv)

require('./patches/console')
require('./keyboard/bindings')

const Cucumber = require('@cucumber/cucumber')

const Output = require('./output')

const output = new Output({ isTTY: options.isTTY })

const { ipcRenderer: ipc } = electron

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

process.on('unhandledRejection', function (reason) {
  output.write(reason.message + '\\n' + reason.stack)
  exitWithCode(3)
})

process.on('exit', exitWithCode)

function exitWithCode(code) {
  if (!options.interactiveMode) electron.remote.process.exit(code)
}

ipc.on('run-cucumber', () => {
  try {
    const argv = options.cucumberArgv
    const cwd = process.cwd()
    new Cucumber.Cli({ argv, cwd, stdout: output }).run().then(result => {
      // sadly, we have to exit immediately, we can't wait for the event loop
      // to drain https://github.com/electron/electron/issues/2358
      exitWithCode(result.success ? 0 : 1)
    })
  } catch (err) {
    output.write(err.stack + '\\n')
    exitWithCode(2)
  }
})

ipc.send('ready-to-run-cucumber')
