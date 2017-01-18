const { defineSupportCode } = require('cucumber')
const { execFile } = require('child_process')
const path = require('path')
const assert = require('assert')
const fs = require('fs-promise')
const mkdirp = require('mkdirp-promise')
const rmfr = require('rmfr')
const stringArgv = require('string-argv')
const colors = require('colors/safe')

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
      var executablePath = path.join(binPath, command.replace('cucumber-electron', 'cucumber-electron.js'))
      var args = stringArgv('')
      args.unshift(executablePath)
      const cwd = this.tmpDir
      this.process = execFile('node', args, { cwd }, (error, stdout, stderr) => {
        if (this.debug) {
          console.log(stdout + stderr) // eslint-disable-line no-console
        }

        this.lastRun = {
          error,
          output: colors.strip(stdout) + stderr
        }
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
          if (this.lastRun.output.indexOf(string) == -1) {
            reject(new Error(`Expected stdout to include:\n${string}\nActual stdout:\n${this.lastRun.output}`))
          }
          resolve()
        }, 1)
      })
    })
  })
})
