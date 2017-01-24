const os = require('os')
const path = require('path')
const assert = require('assert')
const fs = require('fs-promise')
const mkdirp = require('mkdirp-promise')
const rmfr = require('rmfr')
const { defineSupportCode } = require('cucumber')

const { spawn } = require('child_process')
const tempDir = path.resolve(__dirname + '/../../tmp')

defineSupportCode(function ({ Given, When, Then, Before, setDefaultTimeout }) {
  if (os.platform() === 'win32') {
    setDefaultTimeout(15000)
  }

  Before(() => rmfr(tempDir).then(() => mkdirp(tempDir)))

  Given('the file {filePath:stringInDoubleQuotes} contains:', function (filePath, contents) {
    const dir = path.resolve(path.join(tempDir, path.dirname(filePath)))
    return mkdirp(dir).then(() => fs.writeFile(path.join(tempDir, filePath), contents))
  })

  When('I run `{command}`', function (command) {
    const args = command.split(' ')
    args[0] = args[0].replace(/^cucumber-electron/, 'cucumber-electron.js')
    args[0] = path.resolve(__dirname + '/../../bin/' + args[0])

    return new Promise((resolve, reject) => {
      this.execResult = { stdout: '', stderr: '', output: '', exitCode: null }
      this.printExecResult = () =>
        `The process exited with code ${this.spawnedProcess.exitCode}\n` +
        `STDOUT:\n${this.execResult.stdout}\n` +
        `STDERR:\n${this.execResult.stderr}`

      this.spawnedProcess = spawn('node', args, { cwd: tempDir })

      this.spawnedProcess.stdout.on('data', chunk => {
        this.execResult.stdout += chunk.toString()
        this.execResult.output += chunk.toString()
      })
      this.spawnedProcess.stderr.on('data', chunk => {
        this.execResult.stderr += chunk.toString()
        this.execResult.output += chunk.toString()
      })
      this.spawnedProcess.on('error', e => {
        reject(e)
      })
      this.spawnedProcess.on('exit', code => this.execResult.exitCode = code)
      resolve()
    })
  })

  Then('the process should exit with code {exitCode:int}', function (exitCode) {
    return new Promise(resolve => {
      this.spawnedProcess.on('exit', () => {
        assert.equal(this.spawnedProcess.exitCode, exitCode, this.printExecResult())
        resolve()
      })
    })
  })

  Then('the process should not exit', function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exitCode = this.spawnedProcess.exitCode
        if (os.platform() === 'win32') {
          spawn('taskkill' ['/pid', this.spawnedProcess.pid, '/T', '/F'])
        } else {
          // +1 because we are spawning node, which is the parent process
          // https://github.com/nodejs/node/issues/2098
          process.kill(this.spawnedProcess.pid + 1)
        }
        if (exitCode === null) {
          resolve()
        } else {
          reject('The process exited unexpectedly\n' + this.printExecResult())
        }
      }, 500)
    })
  })

  Then('the output should include:', function (string) {
    return new Promise((resolve, reject) => {
      this.spawnedProcess.on('exit', () => {
        setTimeout(() => {
          if (this.execResult.stdout.indexOf(string) == -1) {
            reject(new Error(`Expected stdout to include:\n${string}\n` +
              this.printExecResult()))
          }
          resolve()
        }, 10)
      })
    })
  })
})
