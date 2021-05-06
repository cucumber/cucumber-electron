const BrowserWindowOutput = require('./browserWindowOutput')
const MainProcessOutput = require('./mainProcessOutput')
const { Writable } = require('stream')

class Output extends Writable {
  constructor({ isTTY }) {
    super()
    this._isTTY = isTTY
    this.browserWindowOutput = new BrowserWindowOutput()
    this.mainProcessOutput = new MainProcessOutput()
  }

  _write(chunk, encoding, callback) {
    this.mainProcessOutput.write(chunk, encoding)
    this.browserWindowOutput.write(chunk, encoding)
    // Ideally we'd nest the calls here, but for some reason it doesn't work
    callback()
  }

  get isTTY() {
    return this._isTTY
  }
}

module.exports = Output
