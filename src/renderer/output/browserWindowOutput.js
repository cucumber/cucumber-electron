const AnsiToHtml = require('ansi-to-html')
const { Writable } = require('stream')

class BrowserWindowOutput extends Writable {
  constructor() {
    super()
    this.element = document.body
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
    pre.innerHTML = this.ansiToHtml.toHtml(string, { fg: '#000', bg: '#fff' })
    this.element.appendChild(pre)
  }
}

module.exports = BrowserWindowOutput
