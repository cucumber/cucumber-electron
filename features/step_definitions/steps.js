const { Given, When, Then } = require('cucumber')

Given('the file {string} contains:', async function (filePath, contents) {
  await this.writeFile(filePath, contents)
})

Given('a step definition includes the lines:', async function (lines) {
  const contents = [
    'const { When } = require(\'cucumber\')',
    'When(\'I run that step\', function() {'
  ]
    .concat(lines.split('\n').map(line => '    ' + line))
    .concat([
      '})'
    ]).join('\n')
  await this.writeFile('features/step_definitions/steps.js', contents)
})

When('I run a scenario with that step', async function () {
  const contents = [
    'Feature: With that step',
    '  Scenario: Running that step',
    '    When I run that step'
  ].join('\n')
  await this.writeFile('features/with_that_step.feature', contents)
  await this.runCommand('cucumber-electron features/with_that_step.feature')
})

When('I run a scenario with that step and DEBUG={string}', async function (debugEnvironmentValue) {
  const contents = [
    'Feature: With that step and DEBUG',
    '  Scenario: Running that step and DEBUG',
    '    When I run that step'
  ].join('\n')
  await this.writeFile('features/with_that_step_and_debug.feature', contents)
  await this.runCommand('cucumber-electron features/with_that_step_and_debug.feature', { env: { DEBUG: debugEnvironmentValue } })
})

When('I run `cucumber-electron`', async function () {
  await this.runCommand('cucumber-electron')
})

When('I run `cucumber-electron --interactive`', async function () {
  await this.runCommand('cucumber-electron --interactive')
})

When('I run `cucumber-electron --tags @a`', async function () {
  await this.runCommand('cucumber-electron --tags @a')
})

When('I run `cucumber-electron --tags @b`', async function () {
  await this.runCommand('cucumber-electron --tags @b')
})

When('I run `cucumber-electron --help`', async function () {
  await this.runCommand('cucumber-electron --help')
})

When('I run `cucumber-electron` in a TTY terminal', async function () {
  await this.runCommand('cucumber-electron', { env: { CUCUMBER_ELECTRON_FORCE_TTY: 'true' } })
})

Then('the process should exit with code {int}', async function (exitCode) {
  await this.assertProcessExitedWithCode(exitCode)
})

Then('the process should not exit', async function () {
  await this.assertProcessDidNotExit()
})

Then('the output should include:', async function (expectedOutput) {
  await this.assertOutputIncludes(expectedOutput)
})

Then('stdout should include {string}', async function (expectedOutput) {
  await this.assertStdoutIncludes(expectedOutput)
})

Then('stderr should include {string}', async function (expectedOutput) {
  await this.assertStderrIncludes(expectedOutput)
})

Then('stderr should not include {string}', async function (unexpectedOutput) {
  await this.assertStderrDoesNotInclude(unexpectedOutput)
})

Then('I should see coloured output', async function () {
  await this.assertOutputIncludesColours()
})
