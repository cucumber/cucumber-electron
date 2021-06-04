const BrowserWindowWritable = require('./BrowserWindowWritable')
const { Writable } = require('stream')
const remote = require('electron').remote

class MultiWritable extends Writable {
  constructor({ isTTY, streamName }) {
    super()
    this._isTTY = isTTY
    this.mainProcessWritable = remote.process[streamName]
    this.browserWindowWritable = new BrowserWindowWritable(streamName)
  }

  _write(chunk, encoding, callback) {
    this.mainProcessWritable.write(chunk.toString('utf-8'), encoding)
    this.browserWindowWritable.write(chunk, encoding)
    // Ideally we'd nest the calls here, but for some reason it doesn't work
    callback()
  }

  get isTTY() {
    return this._isTTY
  }
}

module.exports = MultiWritable
