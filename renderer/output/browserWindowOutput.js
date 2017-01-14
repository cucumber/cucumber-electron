const AnsiToHtml = require('ansi-to-html')

class BrowserWindowOutput {
  constructor() {
    this.element = document.body
    this.ansiToHtml = new AnsiToHtml()
  }

  write() {
    Array.prototype.slice.apply(arguments)
      .map(argument => this.escapeTags(argument))
      .forEach(escapedArgument => this.appendTag(escapedArgument))
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
