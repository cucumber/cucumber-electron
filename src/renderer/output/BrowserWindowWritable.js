const AnsiToHtml = require('ansi-to-html')
const { Writable } = require('stream')

class BrowserWindowWritable extends Writable {
  constructor(streamName) {
    super()
    this.element = document.createElement('div')
    this.element.innerHTML = `<h3>${streamName}</h3>`
    document.body.appendChild(this.element)
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

module.exports = BrowserWindowWritable
