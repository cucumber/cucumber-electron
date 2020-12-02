const Options = require('../cli/options')
const electron = require('electron')
const options = new Options(electron.remote.process.argv)

require('./patches/console')
require('./keyboard/bindings')

const Cucumber = require('@cucumber/cucumber')

const Output = require('./output')

const STATUS_SUCCESS = 0
const STATUS_ERROR_DURING_CUCUMBER_RUN = 2
const STATUS_UNCAUGHT_ERROR = 3

const output = new Output({ isTTY: options.isTTY })

const { ipcRenderer: ipc } = electron

const exitWithUncaughtError = (reason) => {
  output.write(reason.stack)
  exitWithCode(STATUS_UNCAUGHT_ERROR)
}

const exitWithCucumberResult = (result) =>
  exitWithCode(result.success ?
    STATUS_SUCCESS :
    STATUS_ERROR_DURING_CUCUMBER_RUN
  )

const exitWithCode = (code = STATUS_SUCCESS) =>
  !options.interactiveMode && electron.remote.process.exit(code)

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

process.on('unhandledRejection', exitWithUncaughtError)

process.on('exit', exitWithCode)

ipc.on('run-cucumber', () => {
  try {
    const cli = new Cucumber.Cli({
      argv: options.cucumberArgv,
      cwd: process.cwd(),
      stdout: output
    })
    // sadly, we have to exit immediately, we can't wait for the event loop
    // to drain https://github.com/electron/electron/issues/2358
    cli.run().then(
      exitWithCucumberResult,
      exitWithUncaughtError
    )
  } catch (err) { exitWithUncaughtError(err) }
})

ipc.send('ready-to-run-cucumber')
