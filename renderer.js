var electron = require('electron')
var Convert = require('ansi-to-html')
var convert = new Convert()
var Cucumber = require('cucumber')

// HACK:
// window.Gherkin !== require('gherkin') in browsers, so parsing fails unless:
require('gherkin').Parser = window.Gherkin.Parser
require('gherkin').Compiler = window.Gherkin.Compiler
require('gherkin').DIALECTS = window.Gherkin.DIALECTS

var stdout = electron.remote.process.stdout

function log() {
  var args = [].slice.apply(arguments)
  stdout.write.apply(null, args)
  var output = convert.toHtml(args[0].toString(), { fg: '#000', bg: '#fff' })
  var pre = document.createElement('pre')
  pre.innerHTML = output
  document.body.appendChild(pre)
}

var PrettyFormatter = Cucumber.Listener.PrettyFormatter
Cucumber.Listener.PrettyFormatter = function(options) {
  options.logToFunction = log
  return PrettyFormatter(options)
}

var args = JSON.parse(decodeURIComponent(window.location.hash.substr(1)))

var cli = Cucumber.Cli([`${__dirname}/node_modules/.bin/cucumberjs`, __dirname].concat(args));

try {
  cli.run(function (succeeded) {
    electron.remote.process.exit(succeeded ? 0 : 1)
  });
} catch (err) {
  log(err.stack)
  electron.remote.process.exit(2)
}
