var Convert = require('ansi-to-html')
var convert = new Convert()
var Cucumber = require('cucumber')

// HACK:
// window.Gherkin !== require('gherkin') in browsers, so parsing fails unless:
require('gherkin').Parser = window.Gherkin.Parser
require('gherkin').Compiler = window.Gherkin.Compiler
require('gherkin').DIALECTS = window.Gherkin.DIALECTS

var Formatter = Cucumber.Listener.Formatter
Cucumber.Listener.Formatter = function(options) {
  options.logToFunction = function() {
    var args = [].slice.apply(arguments)
    var output = convert.toHtml(args[0].toString(), { fg: '#000', bg: '#fff' })
    var pre = document.createElement('pre')
    pre.innerHTML = output
    document.body.appendChild(pre)
  }
  return Formatter(options)
}

var args = JSON.parse(decodeURIComponent(window.location.hash.substr(1)))

var cli = Cucumber.Cli([`${__dirname}/node_modules/.bin/cucumberjs`, __dirname].concat(args));

cli.run(function (succeeded) {
  // TODO: tell the parent process what happened so it can exit
});
