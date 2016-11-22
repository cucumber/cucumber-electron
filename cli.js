const program = require('commander')

module.exports = function cli(argv) {
  return program
    .option('--electron-debug', 'Show the browser window and keep it open after running features')
    .parse(argv)
}
