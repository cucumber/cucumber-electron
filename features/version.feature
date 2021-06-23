Feature: Version
  Scenario: Running the CLI with --version
    When I run `cucumber-electron --version`
    Then stdout should include "Cucumber.js: 7.3.0"
    And stdout should include the version of Cucumber-electron
