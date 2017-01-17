const { defineSupportCode } = require('cucumber')
const exec = require('child_process').exec
const path = require('path')
const assert = require('assert')
const fs = require('fs-promise')
const mkdirp = require('mkdirp-promise')
const rmfr = require('rmfr')

const tmpDir = path.resolve(path.join(__dirname, '..', '..', 'tmp'))
const binPath = path.resolve(path.join(__dirname, '..', '..', 'bin'))

defineSupportCode(function ({ Given, When, Then, Before }) {
  Before(() => rmfr(tmpDir).then(() => mkdirp(tmpDir)))

  Given('the file {filePath:stringInDoubleQuotes} contains:', function (filePath, contents) {
    const dir = path.resolve(path.join(tmpDir, path.dirname(filePath)))
    return mkdirp(dir).then(() => fs.writeFile(path.join(tmpDir, filePath), contents))
  })

  When('I run `{command}`', function (command) {
    return new Promise(resolve => {
      command = path.join(binPath, command.replace('cucumber-electron', 'cucumber-electron.js'))
      const cwd = this.tmpDir
      this.process = exec('node ' + command, { cwd }, (error, stdout, stderr) => {
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
        resolve()
        this.process.kill('SIGINT')
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
