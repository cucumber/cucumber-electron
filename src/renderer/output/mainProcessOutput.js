const remote = require('electron').remote
const { Writable } = require('stream')

class MainProcessOutput extends Writable {
  constructor() {
    super()
    this.stdout = remote.process.stdout
  }

  _write(chunk, encoding, callback) {
    this.stdout.write(chunk, encoding)
    // For some reason passing the callback doesn't work
    callback()
  }
}

module.exports = MainProcessOutput
