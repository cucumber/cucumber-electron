const AnsiToHtml = require('ansi-to-html')
const { Writable } = require('stream')
const fakeWindow = require('../fakeWindow')

class BrowserWindowWritable extends Writable {
  constructor(streamName) {
    super()
    const $fakeBrowserWindow = fakeWindow(
      document,
      streamName.toUpperCase(),
      'cucumber-electron-terminal',
    )
    document.body.appendChild($fakeBrowserWindow)
    this.$terminalElement = $fakeBrowserWindow.querySelector('.cucumber-electron-window-pane')
    document.body.appendChild($fakeBrowserWindow)
    this.ansiToHtml = new AnsiToHtml()
  }

  _write(chunk, encoding, callback) {
    this.appendTag(this.escapeTags(chunk.toString('utf-8')))
    callback()
  }

  escapeTags(argument) {
    return argument.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  appendTag(string) {
    const pre = document.createElement('pre')
    pre.innerHTML = this.ansiToHtml.toHtml(string)
    this.$terminalElement.appendChild(pre)
  }
}

module.exports = BrowserWindowWritable
