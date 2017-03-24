Feature: Multiple Sessions

  @only-runs-in-cucumber-electron
  Scenario: Hosting the same web app in multiple frames
    Given a web app is running
    When I load the app on different hostnames in two separate frames
    Then they should have independent sessions
