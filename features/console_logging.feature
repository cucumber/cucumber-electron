Feature: Console logging

  Scenario: console.log output appears on the command line
    Given the file "features/logging.feature" contains:
      """
      Feature: Logging
        Scenario: console.log
          When I log something
      """
    And the file "features/step_definitions/steps.js" contains:
      """
      const { defineSupportCode } = require('cucumber')
      const assert = require('assert')

      defineSupportCode(function ({ When }) {
        When(/^I log something$/, function () {
          console.log("Logged from a step definition", 123)
        })
      })
      """
    When I run `cucumber-electron`
    Then the output should include:
      """
      Logged from a step definition 123
      """
