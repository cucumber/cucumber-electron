const electron = require('electron')

class MainProcessOutput {
  constructor() {
    this.stdout = electron.remote.process.stdout
  }

  write() {
    Array.prototype.slice.apply(arguments)
      .forEach(argument => this.stdout.write(argument.toString()))
  }
}

module.exports = MainProcessOutput
