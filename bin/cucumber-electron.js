#!/usr/bin/env node

const spawn = require('child_process').spawn
const path = require('path')

const electron = require('electron')

const args = process.argv.slice(2)
if ((args.length === 1 && args[0] === '--help') || args[0] === '-h') {
  showHelp()
} else if ((args.length === 1 && args[0] === '--version') || args[0] === '-V') {
  showVersion()
} else {
  runCucumberInRendererProcess()
}

function showHelp() {
  require('../src/cli/help')
}

function showVersion() {
  require('../src/cli/version')
}

function runCucumberInRendererProcess() {
  args.unshift(path.resolve(path.join(__dirname, '../src/renderer/main.js')))
  if (process.stdout.isTTY || process.env.CUCUMBER_ELECTRON_FORCE_TTY === 'true') {
    args.push('--TTY')
  }

  const child = spawn(electron, args)
  child.on('exit', function (code) {
    process.exit(code)
  })

  child.stdout.pipe(process.stdout)
  process.stdin.pipe(child.stdin)

  child.stderr.on('data', function (data) {
    const str = data.toString('utf-8')
    // Mute irrelevant chromium errors
    if (str.match(/^\[\d+:\d+/) || str.match(/Couldn't set selectedTextBackgroundColor/)) return
    process.stderr.write(data)
  })
}
