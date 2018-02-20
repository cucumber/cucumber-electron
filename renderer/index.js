require('./patches/console')
require('./keyboard/bindings')

const electron = require('electron')
const Cucumber = require('cucumber')

const Options = require('../cli/options')
const Output = require('./output')

const output = new Output()
const options = new Options(electron.remote.process.argv)

const { ipcRenderer: ipc } = require('electron')

process.on('unhandledRejection', function (reason) {
  output.write(reason.message + '\\n' + reason.stack)
  exitWithCode(3)
})

function exitWithCode(code) {
  if (!options.electronDebug) electron.remote.process.exit(code)
}

ipc.on('run-cucumber', () => {
  try {
    const argv = options.cucumberArgv
    const cwd = process.cwd()
    const stdout = new Output()
    new Cucumber.Cli({ argv, cwd, stdout }).run()
      .then(result => {
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
