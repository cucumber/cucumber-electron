const Cucumber = require('@cucumber/cucumber')

module.exports = (stdoutRewrite) => {
  const write = process.stdout.write

  process.stdout.write = (chunk, ...args) => {
    chunk = chunk.split('\n').map(stdoutRewrite).join('\n')
    write.call(process.stdout, chunk, ...args)
  }

  new Cucumber.Cli({
    argv: process.argv,
    cwd: process.cwd(),
    stdout: process.stdout
  }).run()
}
