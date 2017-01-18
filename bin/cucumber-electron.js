const electron = require('electron')
const spawn = require('child_process').spawn
const path = require('path')

var args = [path.join(__dirname, '..')].concat(process.argv.slice(2))
const child = spawn(electron, args, { stdio: 'inherit' })

child.on('close', (code) => {
  if (code !== 0) {
    console.log(`child process exited with code ${code}`)
  }
  process.exit(code)
})

process.on('SIGINT', function () {
  child.kill('SIGINT')
  child.kill('SIGTERM')
})
