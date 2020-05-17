const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { promisify } = require('util')
const assert = require('assert')
const colors = require('colors')

const writeFile = promisify(fs.writeFile)
const rmdir = promisify(fs.rmdir)
const mkdir = promisify(fs.mkdir)

const { setWorldConstructor, setDefaultTimeout, Before } = require('cucumber')

class CucumberElectronWorld {
  constructor() {
    this.tempDir = path.resolve(__dirname + '/../../tmp')
  }

  async writeFile(filePath, contents) {
    const dir = path.resolve(path.join(this.tempDir, path.dirname(filePath)))
    await mkdir(dir, { recursive: true })
    await writeFile(
      path.join(this.tempDir, filePath),
      contents
    )
  }

  async runCommand(command, { env } = { env: {} }) {
    const args = command.split(' ')
    args[0] = args[0].replace(/^cucumber-electron/, 'cucumber-electron.js')
    args[0] = path.resolve(__dirname + '/../../bin/' + args[0])

    return new Promise((resolve, reject) => {
      this.execResult = { stdout: '', stderr: '', output: '', exitCode: null }
      this.printExecResult = () =>
        '------------------------------------\n' +
        `The process exited with code ${this.spawnedProcess.exitCode}\n` +
        '------------------------------------\n' +
        `OUTPUT:\n${this.execResult.output}\n` +
        '------------------------------------\n' +
        `STDOUT:\n${this.execResult.stdout}\n` +
        '------------------------------------\n' +
        `STDERR:\n${this.execResult.stderr}\n` +
        '------------------------------------\n'

      const childEnv = Object.assign(process.env, env)
      this.spawnedProcess = spawn('node', args, {
        cwd: this.tempDir,
        env: childEnv,
        detached: true
      })

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
      this.spawnedProcess.on('exit', code => (this.execResult.exitCode = code))
      resolve()
    })
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
    assert.equal(
      this.spawnedProcess.exitCode,
      expectedExitCode,
      this.printExecResult()
    )
  }

  async assertOutputIncludes(expectedOutput, stream = 'output') {
    await this.ensureProcessHasExited()
    const normalisedExpectedOutput = expectedOutput.replace('\r\n', '\n')
    const normalisedActualOutput = colors
      .strip(this.execResult[stream])
      .replace('\r\n', '\n')
    if (normalisedActualOutput.indexOf(normalisedExpectedOutput) === -1) {
      throw new Error(
        `Expected ${stream} to include:\n${normalisedExpectedOutput}\n` +
          this.printExecResult()
      )
    }
  }

  async assertOutputDoesNotInclude(expectedOutput, stream = 'output') {
    await this.ensureProcessHasExited()
    const normalisedExpectedOutput = expectedOutput.replace('\r\n', '\n')
    const normalisedActualOutput = colors
      .strip(this.execResult[stream])
      .replace('\r\n', '\n')
    if (normalisedActualOutput.indexOf(normalisedExpectedOutput) !== -1) {
      throw new Error(
        `Did not expect ${stream} to include:\n${normalisedExpectedOutput}\n` +
        this.printExecResult()
      )
    }
  }

  async assertStdoutIncludes(expectedOutput) {
    return this.assertOutputIncludes(expectedOutput, 'stdout')
  }

  async assertStderrIncludes(expectedOutput) {
    // On windows, everything goes out of stderr. Electron.exe needs a shim, or something
    const errorStream = os.platform() === 'win32' ? 'stdout' : 'stderr'
    return this.assertOutputIncludes(expectedOutput, errorStream)
  }

  async assertStderrDoesNotInclude(unexpectedOutput) {
    const errorStream = os.platform() === 'win32' ? 'stdout' : 'stderr'
    return this.assertOutputDoesNotInclude(unexpectedOutput, errorStream)
  }

  async assertOutputIncludesColours() {
    await this.ensureProcessHasExited()
    if (this.execResult.stdout.indexOf('\x1B[39m') === -1) {
      throw new Error('Expected coloured output')
    }
  }
}

setDefaultTimeout(15000)

setWorldConstructor(CucumberElectronWorld)

Before(async function () {
  await rmdir(this.tempDir, { recursive: true })
})
Before(async function () {
  await mkdir(this.tempDir, { recursive: true })
})
