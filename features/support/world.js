const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const assert = require('assert')
const colors = require('colors')
const del = require('del')
const mkdirp = require('mkdirp')

const { setWorldConstructor, setDefaultTimeout, Before } = require('@cucumber/cucumber')

class CucumberElectronWorld {
  constructor() {
    this.tempDir = path.resolve(__dirname + '/../../tmp')
  }

  async writeFile(filePath, contents) {
    const dir = path.resolve(path.join(this.tempDir, path.dirname(filePath)))
    mkdirp.sync(dir)
    fs.writeFileSync(path.join(this.tempDir, filePath), contents)
  }

  runCommand(command, { env } = { env: {} }) {
    const args = command.split(' ')
    args[0] = args[0].replace(/^cucumber-electron/, 'cucumber-electron.js')
    args[0] = path.resolve(__dirname + '/../../bin/' + args[0])

    this.execResult = { stdout: '', stderr: '', exitCode: null, error: null }
    this.printExecResult = () =>
      '------------------------------------\n' +
      `The process exited with code ${this.spawnedProcess.exitCode}\n` +
      '------------------------------------\n' +
      `Exception:\n${(this.execResult.error && this.execResult.error.stack) || ''}\n` +
      '------------------------------------\n' +
      `STDOUT:\n${this.execResult.stdout}\n` +
      '------------------------------------\n' +
      `STDERR:\n${this.execResult.stderr}\n` +
      '------------------------------------\n'

    const childEnv = Object.assign(process.env, env)
    this.spawnedProcess = spawn('node', args, {
      cwd: this.tempDir,
      env: childEnv,
      detached: true,
    })

    this.spawnedProcess.stdout.on('data', chunk => {
      this.execResult.stdout += chunk.toString()
    })
    this.spawnedProcess.stderr.on('data', chunk => {
      this.execResult.stderr += chunk.toString()
    })
    this.spawnedProcess.on('error', e => {
      this.execResult.error = e
    })
    this.spawnedProcess.on('exit', code => (this.execResult.exitCode = code))
  }

  async ensureProcessHasExited() {
    if (this.spawnedProcess.exitCode == null) {
      return new Promise(resolve => {
        this.spawnedProcess.on('exit', code => {
          this.execResult.exitCode = code
          resolve()
        })
      })
    }
  }

  async assertProcessDidNotExit() {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const exitCode = this.spawnedProcess.exitCode
    if (exitCode === null) {
      await this.killChild()
    } else {
      throw new Error('The process exited unexpectedly\n' + this.printExecResult())
    }
  }

  async killChild() {
    if (os.platform() === 'win32') {
      spawn('taskkill', ['/pid', this.spawnedProcess.pid, '/T', '/F'])
    } else {
      // Kill the process and all its children (all processes in the same process group).
      // See http://man7.org/linux/man-pages/man2/kill.2.html
      process.kill(-this.spawnedProcess.pid)
    }
  }

  async assertProcessExitedWithCode(expectedExitCode) {
    await this.ensureProcessHasExited()
    if (this.execResult.error) throw this.execResult.error
    assert.strictEqual(this.spawnedProcess.exitCode, expectedExitCode, this.printExecResult())
  }

  async assertOutputIncludes(expectedOutput, stream) {
    await this.ensureProcessHasExited()
    const normalisedExpectedOutput = expectedOutput.replace('\r\n', '\n')
    const normalisedActualOutput = colors.strip(this.execResult[stream]).replace('\r\n', '\n')
    if (normalisedActualOutput.indexOf(normalisedExpectedOutput) === -1) {
      throw new Error(
        `Expected ${stream} to include:\n${normalisedExpectedOutput}\n` + this.printExecResult(),
      )
    }
  }

  async assertStdoutIncludes(expectedOutput) {
    return this.assertOutputIncludes(expectedOutput, 'stdout')
  }

  async assertStderrIncludes(expectedOutput) {
    return this.assertOutputIncludes(expectedOutput, 'stderr')
  }

  async assertOutputIncludesColours() {
    await this.ensureProcessHasExited()
    if (this.execResult.stdout.indexOf('\x1B[39m') === -1) {
      throw new Error('Expected coloured stdout, but was:\n' + this.printExecResult())
    }
  }
}

setDefaultTimeout(15000)

setWorldConstructor(CucumberElectronWorld)

Before(async function () {
  await del(this.tempDir)
})

Before(function () {
  mkdirp.sync(this.tempDir)
})
