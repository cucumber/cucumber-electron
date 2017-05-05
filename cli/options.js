class Options {
  constructor(argv) {
    this.cucumberArgv = argv.filter(a => a != '--electron-debug')
    this.electronDebug = argv.length > this.cucumberArgv.length
  }
}

module.exports = Options
