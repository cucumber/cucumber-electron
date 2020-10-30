const Cucumber = require('@cucumber/cucumber')

const write = process.stdout.write
process.stdout.write = (chunk, ...args) => {
  chunk = chunk.split('\n').map(rewriteExitLine).join('\n')
  write.call(process.stdout, chunk, ...args)
}

function rewriteExitLine(line) {
  if (line.match(/\s+--exit/) == null) {
    return line
  }
  return [
    '    --exit                          UNSUPPORTED in cucumber-electron: force shutdown of the event loop when the test run has finished',
    '    -i, --interactive               open an interactive debugger (chromium dev tools)'
  ].join('\n')
}
new Cucumber.Cli({
  argv: process.argv,
  cwd: process.cwd(),
  stdout: process.stdout
}).run()
