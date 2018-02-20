class Options {
  constructor(argv) {
    this.cucumberArgv = argv.filter(a => a != '--interactive' && a != '-i' && a != '--interactive')
    this.electronDebug = argv.length > this.cucumberArgv.length
  }
}

module.exports = Options
