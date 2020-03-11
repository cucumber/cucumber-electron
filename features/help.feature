Feature: Help
  Scenario: Running the CLI with --help
    When I run `cucumber-electron --help`
    Then stdout should include "Usage: cucumber-electron"
    And stdout should include "--interactive"
    And stdout should include "UNSUPPORTED in cucumber-electron: force shutdown of the event loop"
    And stdout should include "For more details please visit https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md"
