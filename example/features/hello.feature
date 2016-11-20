Feature: Hello
  Scenario: Say hello
    Given I have visited the app
    When I ask it to say something
    Then it says hello

  Scenario: Say hello in HTML
    Given I have visited the app
    When I ask it to tell me in HTML
    Then it says:
      """
      <i>Hello!</i>
      """
