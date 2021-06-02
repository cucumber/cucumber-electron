Feature: Exception handling

  Scenario: an exception thrown in a step
    Given the file "features/a.feature" contains:
        """
        Feature: a feature
          Scenario: a scenario
            Given a failing step
        """
    And the file "features/step_definitions/steps.js" contains:
        """
        const { Given } = require('@cucumber/cucumber')
        Given(/^a failing step$/, function () { throw new Error('I am a failing step') })
        """
    When I run `cucumber-electron`
    Then the process should exit with code 2

  Scenario: an exception thrown before Cucumber starts
    Given the file "features/b.feature" contains:
        """
        Feature:
          Scenario:
            Given some step
        """
    And the file "features/step_definitions/steps.js" contains:
        """
        const { Before } = require('@cucumber/cucumber')
        Before(() => { throw new Error('I am a failing hook') })
        """
    When I run `cucumber-electron`
    Then the process should exit with code 2

  Scenario: an exception thrown before Cucumber starts
    Given the file "features/c.feature" contains:
        """
        Feature:
          Scenario:
            Given some step
        """
    And the file "features/step_definitions/steps.js" contains:
        """
        throw new Error('I fail early')
        """
    When I run `cucumber-electron`
    Then the process should exit with code 3

  Scenario: an exception thrown because of a syntax error
    Given the file "features/b.feature" contains:
        """
        Feature:
          Scenario:
            Given some step
        """
    And the file "features/step_definitions/steps.js" contains:
        """
        haha it is not valid Javascript!!!
        """
    When I run `cucumber-electron`
    Then the process should exit with code 3
    And stderr should include "SyntaxError: Unexpected identifier"