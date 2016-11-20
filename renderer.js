var electron = require('electron')
var Convert = require('ansi-to-html')
var convert = new Convert()
var Cucumber = require('cucumber')

// HACK:
// window.Gherkin !== require('gherkin') in browsers, so parsing fails unless:
require('gherkin').Parser = window.Gherkin.Parser
require('gherkin').Compiler = window.Gherkin.Compiler
require('gherkin').DIALECTS = window.Gherkin.DIALECTS


var cli = require('./cli')(electron.remote.process.argv)

var stdout = electron.remote.process.stdout

function log() {
  var args = [].slice.apply(arguments)
  stdout.write.apply(null, args)
  var htmlSafeOutput = args[0].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')
  var pre = document.createElement('pre')
  pre.innerHTML = convert.toHtml(htmlSafeOutput, { fg: '#000', bg: '#fff' })
  document.body.appendChild(pre)
}

var PrettyFormatter = Cucumber.Listener.PrettyFormatter
Cucumber.Listener.PrettyFormatter = function(options) {
  options.logToFunction = log
  return PrettyFormatter(options)
}

var args = JSON.parse(decodeURIComponent(window.location.hash.substr(1)))

var cucumberCli = Cucumber.Cli([`${__dirname}/node_modules/.bin/cucumberjs`, __dirname].concat(args));

function exitWithCode(code) {
  if (cli.electronDebug) return
  electron.remote.process.exit(code)
}

try {
  cucumberCli.run(function(succeeded) {
    exitWithCode(succeeded ? 0 : 1)
  });
} catch (err) {
  log(err.stack)
  exitWithCode(2)
}

document.body.addEventListener("keydown", function(e) {
  e = e || window.event;
  var key = e.which || e.keyCode;
  var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false);
  if ( key == 67 && ctrl ) { electron.remote.process.exit(0) }
}, false);
