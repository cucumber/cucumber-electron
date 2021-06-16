const runCli = require('./run')

const rewriteExitLine = line =>
  line.match(/\s+--exit/) === null
    ? line
    : [
        '    --exit                          UNSUPPORTED in cucumber-electron: force shutdown of the event loop when the test run has finished',
        '    -i, --interactive               open an interactive debugger (chromium dev tools)',
        '    --stylesheet [PATH]             load the stylesheet specified by [PATH]',
      ].join('\n')

runCli(rewriteExitLine)
