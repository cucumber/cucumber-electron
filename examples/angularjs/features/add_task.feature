Feature: Add Task

  Scenario: Add one task
    When you add the task "buy milk"
    Then the list of active tasks contains:
      | buy milk |

  Scenario: Add two task
    When you add the task "buy milk"
    When you add the task "get kids"
    Then the list of active tasks contains:
      | buy milk |
      | get kids |
