const commander = require('commander')

class Options {
  constructor(argv) {
    const args = commander
      .option('--electron-debug',
              'Show the browser window and keep it open after running features')
      .parse(argv)

    this.electronDebug = args.electronDebug

    this.cucumberArgv = argv.filter(a => a != '--electron-debug')
  }
}

module.exports = Options
