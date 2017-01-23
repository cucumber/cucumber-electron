#!/usr/bin/env node

var spawn = require('child_process').spawn
var path = require('path')
var which = require('which')

var electron = process.env.ELECTRON_PATH ||
  resolve('electron') || resolve('electron-prebuilt') ||
  resolve('electron', which.sync)

run(electron)

function resolve(module, resolver) {
  try {
    return (resolver || require)(module)
  } catch (_) {
    // ignore
  }
}

function run(electron) {
  var args = process.argv.slice(2)
  args.unshift(path.resolve(path.join(__dirname, '../index.js')))

  var child = spawn(electron, args)
  child.stdout.pipe(process.stdout)
  process.stdin.pipe(child.stdin)

  child.stderr.on('data', function (data) {
    var str = data.toString('utf8')
    // it's Chromium, STFU
    if (str.match(/^\[\d+\:\d+/)) return
    process.stderr.write(data)
  })
  child.on('exit', function (code) { process.exit(code) })
}
