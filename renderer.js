const electron = require('electron')
const Convert = require('ansi-to-html')
const convert = new Convert()
const Cucumber = require('cucumber')

// HACK:
// window.Gherkin !== require('gherkin') in browsers, so parsing fails unless:
require('gherkin').Parser = window.Gherkin.Parser
require('gherkin').Compiler = window.Gherkin.Compiler
require('gherkin').DIALECTS = window.Gherkin.DIALECTS


const cli = require('./cli')(electron.remote.process.argv)

function log() {
  const args = [].slice.apply(arguments)
  const htmlSafeOutput = args[0].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const pre = document.createElement('pre')
  pre.innerHTML = convert.toHtml(htmlSafeOutput, { fg: '#000', bg: '#fff' })
  document.body.appendChild(pre)
}

const PrettyFormatter = Cucumber.Listener.PrettyFormatter
Cucumber.Listener.PrettyFormatter = function(options) {
  options.logToFunction = log
  return PrettyFormatter(options)
}

const args = JSON.parse(decodeURIComponent(window.location.hash.substr(1)))

const cucumberCli = Cucumber.Cli([`${__dirname}/node_modules/.bin/cucumberjs`, __dirname].concat(args))

function exitWithCode(code) {
  if (cli.electronDebug) return
  electron.remote.process.exit(code)
}

try {
  cucumberCli.run(succeeded => exitWithCode(succeeded ? 0 : 1))
} catch (err) {
  log(err.stack)
  exitWithCode(2)
}

document.body.addEventListener('keydown', e => {
  e = e || window.event
  const key = e.which || e.keyCode
  const ctrl = e.ctrlKey ? e.ctrlKey : key === 17
  if ( key == 67 && ctrl ) electron.remote.process.exit(0)
}, false)
