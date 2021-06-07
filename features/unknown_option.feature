@wip
Feature: Unknown CLI option
  Scenario: Running the CLI with an unknown option
    When I run `cucumber-electron --unknown-option`
    Then stderr should include "error: unknown option '--unknown-option'"
    Then the process should exit with code 1
