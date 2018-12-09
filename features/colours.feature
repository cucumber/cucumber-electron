Feature: Colours

  Scenario: Output includes colours when stdout is a TTY
    Given the file "features/rainbows.feature" contains:
      """
      Feature: Rainbows
        Scenario: All the colours
          Given I have not implemented this
      """
    When I run `cucumber-electron` in a TTY terminal
    Then I should see coloured output
