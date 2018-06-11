Feature: Add Task

  Scenario: Add one task
    When you add the task "buy milk"
    Then the list of active tasks contains:
      | buy milk |
