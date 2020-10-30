Feature: Help
  Scenario: Running the CLI with --help
    When I run `cucumber-electron --version`
    Then stdout should include "Cucumber.js: 7.0.0-rc.0"
    And stdout should include "Cucumber-electron: 3.0.0-rc.0"
