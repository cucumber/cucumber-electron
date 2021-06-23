Feature: App Elements

  Scenario: Two app elements
    Given Josh has an app element with:
      ```
      <h1>This is Josh's app</h1>
      ```
    And Romain has an app element with:
      ```
      <h1>This is Romain's app</h1>
      ```

  Scenario:
    Given a failing step
    And an undefined step
    And a failing step
