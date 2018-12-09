const { Given, When, Then } = require('cucumber')

Given('the file {string} contains:', function (filePath, contents) {
  return this.writeFile(filePath, contents)
})

Given('a step definition includes the lines:', function (lines) {
  const contents = [
    'const { When } = require(\'cucumber\')',
    'When(\'I run that step\', function() {'
  ]
    .concat(lines.split('\n').map(line => '    ' + line))
    .concat([
      '})'
    ]).join('\n')
  return this.writeFile('features/step_definitions/steps.js', contents)
})

When('I run a scenario with that step', function () {
  const contents = [
    'Feature: With that step',
    '  Scenario: Running that step',
    '    When I run that step'
  ].join('\n')
  return this.writeFile('features/with_that_step.feature', contents)
    .then(() => {
      return this.runCommand('cucumber-electron features/with_that_step.feature')
    })
})

When('I run a scenario with that step and DEBUG={string}', function (debugEnvironmentValue) {
  const contents = [
    'Feature: With that step and DEBUG',
    '  Scenario: Running that step and DEBUG',
    '    When I run that step'
  ].join('\n')
  return this.writeFile('features/with_that_step_and_debug.feature', contents)
    .then(() => {
      return this.runCommand('cucumber-electron features/with_that_step_and_debug.feature', { env: { DEBUG: debugEnvironmentValue } })
    })
})

When('I run `cucumber-electron`', function () {
  return this.runCommand('cucumber-electron')
})

When('I run `cucumber-electron --interactive`', function () {
  return this.runCommand('cucumber-electron --interactive')
})

When('I run `cucumber-electron --tags @a`', function () {
  return this.runCommand('cucumber-electron --tags @a')
})

When('I run `cucumber-electron --tags @b`', function () {
  return this.runCommand('cucumber-electron --tags @b')
})

When('I run `cucumber-electron --help`', function () {
  return this.runCommand('cucumber-electron --help')
})

When('I run `cucumber-electron` in a TTY terminal', function () {
  return this.runCommand('cucumber-electron', { env: { CUCUMBER_ELECTRON_FORCE_TTY: 'true' } })
})

Then('the process should exit with code {int}', function (exitCode) {
  return this.assertProcessExitedWithCode(exitCode)
})

Then('the process should not exit', function () {
  return this.assertProcessDidNotExit()
})

Then('the output should include:', function (expectedOutput) {
  return this.assertOutputIncludes(expectedOutput)
})

Then('stdout should include {string}', function (expectedOutput) {
  return this.assertStdoutIncludes(expectedOutput)
})

Then('stderr should include {string}', function (expectedOutput) {
  return this.assertStderrIncludes(expectedOutput)
})

Then('I should see coloured output', function () {
  return this.assertOutputIncludesColours()
})