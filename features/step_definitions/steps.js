const os = require('os')
const path = require('path')
const childProcess = require('child_process')
const assert = require('assert')
const fs = require('fs-promise')
const mkdirp = require('mkdirp-promise')
const rmfr = require('rmfr')
const { defineSupportCode } = require('cucumber')

const exec = childProcess.exec
const tempDir = path.resolve(__dirname + '/../../tmp')

defineSupportCode(function({ Given, When, Then, Before, setDefaultTimeout }) {
  if (os.platform() === 'win32') {
    setDefaultTimeout(15000)
  }

  Before(() => rmfr(tempDir).then(() => mkdirp(tempDir)))

  Given('the file {filePath:stringInDoubleQuotes} contains:', function (filePath, contents) {
    const dir = path.resolve(path.join(tempDir, path.dirname(filePath)))
    return mkdirp(dir).then(() => fs.writeFile(path.join(tempDir, filePath), contents))
  })

  When('I run `{command}`', function (command) {
    const binPath = path.resolve(__dirname + '/../../bin')
    return new Promise(resolve => {
      command = path.join(binPath, command.replace('cucumber-electron', 'cucumber-electron.js'))
      this.process = exec('node ' + command, { cwd: tempDir }, (error, stdout, stderr) => {
        this.execResult = { error, stdout, stderr }
      })
      this.process.stdout.on('data', () => resolve())
    })
  })

  Then('the process should exit with code {exitCode:int}', function (exitCode) {
    return new Promise(resolve => {
      this.process.on('exit', () => {
        assert.equal(this.process.exitCode, exitCode)
        resolve()
      })
    })
  })

  Then('the process should not exit', function () {
    return new Promise((resolve, reject) => {
      this.process.on('exit', () => {
        reject(new Error('The process exited'))
      })
      setTimeout(() => {
        if (os.platform() === 'win32') {
          exec('taskkill /pid ' + this.process.pid + ' /T /F')
        } else {
          this.process.kill('SIGINT')
          this.process.kill('SIGTERM')
        }
        resolve()
      }, 500)
    })
  })

  Then('the output should include:', function (string) {
    return new Promise((resolve, reject) => {
      this.process.on('exit', () => {
        setTimeout(() => {
          if (this.execResult.stdout.indexOf(string) == -1) {
            reject(new Error(`Expected stdout to include:\n${string}\nActual stdout:\n${this.execResult.stdout}`))
          }
          resolve()
        }, 1)
      })
    })
  })
})
