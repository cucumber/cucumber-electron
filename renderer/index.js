const Options = require('../cli/options')
const electron = require('electron')
const options = new Options(electron.remote.process.argv)

require('./patches/console')
require('./patches/debug')({ isTTY: options.isTTY })
require('./keyboard/bindings')

const Cucumber = require('cucumber')

const Output = require('./output')

const output = new Output({ isTTY: options.isTTY })

const { ipcRenderer: ipc } = electron

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

process.on('unhandledRejection', function (reason) {
  output.write(reason.message + '\\n' + reason.stack)
  exitWithCode(3)
})

function exitWithCode(code) {
  if (!options.interactiveMode) electron.remote.process.exit(code)
}

ipc.on('run-cucumber', () => {
  try {
    const argv = options.cucumberArgv
    const cwd = process.cwd()
    new Cucumber.Cli({ argv, cwd, stdout: output }).run().then(result => {
      // cucumber-js 4 changes the boolean result to an object
      const resultIsObject = typeof result === 'object'
      const success = resultIsObject ? result.success : !!result
      const exitCode = success ? 0 : 1
      // sadly, we have to exit immediately, we can't wait for the event loop
      // to drain https://github.com/electron/electron/issues/2358
      exitWithCode(exitCode)
    })
  } catch (err) {
    output.write(err.stack + '\\n')
    exitWithCode(2)
  }
})

ipc.send('ready-to-run-cucumber')
