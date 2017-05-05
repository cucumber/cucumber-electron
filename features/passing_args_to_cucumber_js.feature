Feature: Passing args to cucumber.js

  Scenario: Passing @tags
    Given the file "features/with_tags.feature" contains:
        """
        Feature: with tags
          @a @b
          Scenario: Scenario 1
            Given I am tagged

          @a
          Scenario: Scenario 2
            Given I am tagged
        """
    When I run `cucumber-electron --tags @a`
    Then stdout should include "2 scenarios"
    When I run `cucumber-electron --tags @b`
    Then stdout should include "1 scenario"
