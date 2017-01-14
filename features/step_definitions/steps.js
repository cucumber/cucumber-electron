const path = require('path')
const exec = require('child_process').exec
const assert = require('assert')
const fs = require('fs-promise')
const mkdirp = require('mkdirp-promise')
const rmfr = require('rmfr')
const { defineSupportCode } = require('cucumber')
const tempDir = path.resolve(__dirname + '/../../tmp')

defineSupportCode(function({ Given, When, Then, Before }) {

  Before(() => rmfr(tempDir).then(() => mkdirp(tempDir)))

  Given('the file {filePath:stringInDoubleQuotes} contains:', function (filePath, contents) {
    const dir = path.resolve(tempDir + '/' + path.dirname(filePath))
    return mkdirp(dir).then(() => fs.writeFile(tempDir + '/' + filePath, contents))
  })

  When('I run `{command}`', function (command) {
    const binPath = path.resolve(__dirname + '/../../bin')
    return new Promise(resolve => {
      command = binPath + '/' + command.replace('cucumber-electron', 'cucumber-electron.js')
      this.process = exec(command, { cwd: tempDir }, (error, stdout, stderr) => {
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
        reject(new Error("The process exited"))
      })
      setTimeout(() => {
        resolve()
        this.process.kill('SIGINT')
      }, 500)
    })
  })
})
