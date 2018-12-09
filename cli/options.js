class Options {
  constructor(argv) {
    this.interactiveMode = Boolean(argv.find(isInteractiveSwitch))
    this.isTTY = Boolean(argv.find(isTTYSwitch))
    this.cucumberArgv = argv.filter(arg => !isInteractiveSwitch(arg) && !isTTYSwitch(arg))
  }
}

function isInteractiveSwitch(arg) {
  return arg === '--interactive' || arg === '-i'
}

function isTTYSwitch(arg) {
  return arg === '--TTY'
}

module.exports = Options
