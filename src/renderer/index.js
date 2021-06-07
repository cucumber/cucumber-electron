const Options = require('../cli/options')
const electron = require('electron')
const remote = require('electron').remote
const options = new Options(remote.process.argv)

require('./patches/console')
require('./keyboard/bindings')

const Cucumber = require('@cucumber/cucumber')

const MultiWritable = require('./output')

const STATUS_SUCCESS = 0
const STATUS_ERROR_DURING_CUCUMBER_RUN = 2
const STATUS_UNCAUGHT_ERROR = 3

const stdout = new MultiWritable({ isTTY: options.isTTY, streamName: 'stdout' })
const stderr = new MultiWritable({ isTTY: options.isTTY, streamName: 'stderr' })

const { ipcRenderer: ipc } = electron

const exitWithUncaughtError = reason => {
  stderr.write(reason.stack)
  exitWithCode(STATUS_UNCAUGHT_ERROR)
}

const exitWithCucumberResult = result =>
  exitWithCode(result.success ? STATUS_SUCCESS : STATUS_ERROR_DURING_CUCUMBER_RUN)

const exitWithCode = (code = STATUS_SUCCESS) =>
  !options.interactiveMode && ipc.send('cucumber-run-end', code)

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

process.on('unhandledRejection', exitWithUncaughtError)

process.on('exit', exitWithCode)

ipc.on('run-cucumber', () => {
  const cli = new Cucumber.Cli({
    argv: options.cucumberArgv,
    cwd: process.cwd(),
    stdout: stdout,
    // TODO: Cucumber.js 7.2.1 ignores the stderr option. We should fix this.
    stderr: stderr,
  })
  cli.run().then(exitWithCucumberResult).catch(exitWithUncaughtError)
})

ipc.send('ready-to-run-cucumber')
