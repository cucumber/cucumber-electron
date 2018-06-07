#!/usr/bin/env node

var spawn = require('child_process').spawn
var path = require('path')

var electron = require('electron')

var args = process.argv.slice(2)
if (args.length === 1 && args[0] === '--help' || args[0] === '-h') {
  showHelp()
} else {
  runCucumberInRendererProcess()
}

function showHelp() {
  require('../cli/help')
}

function runCucumberInRendererProcess() {
  args.unshift(path.resolve(path.join(__dirname, '../index.js')))

  var child = spawn(electron, args)
  child.stdout.pipe(process.stdout)
  process.stdin.pipe(child.stdin)

  child.stderr.on('data', function (data) {
    var str = data.toString('utf8')
    // Mute irrelevant chromium errors
    if (str.match(/^\[\d+:\d+/) || str.match(/Couldn't set selectedTextBackgroundColor/)) return
    process.stderr.write(data)
  })
  child.on('exit', function (code) { process.exit(code) })
}
