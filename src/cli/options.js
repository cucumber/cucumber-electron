class Options {
  constructor(argv) {
    this.stylesheet = optArg(argv, '--stylesheet')
    this.interactiveMode = Boolean(argv.find(isInteractiveSwitch))
    this.isTTY = Boolean(argv.find(isTTYSwitch))
    this.cucumberArgv = argv.filter(arg => !isInteractiveSwitch(arg) && !isTTYSwitch(arg))
  }
}

function optArg(argv, opt) {
  const optIndex = argv.findIndex(arg => arg === opt)
  if (optIndex !== -1) {
    const value = argv[optIndex + 1]
    argv.splice(optIndex, 2)
    return value
  }
}

function isInteractiveSwitch(arg) {
  return arg === '--interactive' || arg === '-i'
}

function isTTYSwitch(arg) {
  return arg === '--TTY'
}

module.exports = Options
