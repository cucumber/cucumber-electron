Feature: Debug module integration
  Scenario: Running scenarios with DEBUG=*
    Given a step definition includes the lines:
      """
      const debug = require('debug')('gubbins')
      debug('hello %o', { life: 42, element: document.body })
      """
    When I run a scenario with that step and DEBUG="*"
    Then stderr should include "gubbins hello { life: 42, element: HTMLBodyElement {} }"
