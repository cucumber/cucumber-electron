// HACK:
// window.Gherkin !== require('gherkin') in browsers
// Until the fix is released, parsing fails unless we do this:

const gherkin = require('gherkin')
gherkin.Parser = window.Gherkin.Parser
gherkin.Compiler = window.Gherkin.Compiler
gherkin.DIALECTS = window.Gherkin.DIALECTS
