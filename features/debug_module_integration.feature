Feature: Debug module integration
  Scenario: Running scenarios with DEBUG=*
    Given a step definition includes the lines:
      """
      const debug = require('debug')('gubbins')
      debug('hello %o', { life: 42, element: document.body })
      """
    When I run a scenario with that step and DEBUG="*"
    Then stdout should include "gubbins hello '{ life: 42, element: <body /> }'"

  Scenario: Running scenarios without DEBUG set
    Given a step definition includes the lines:
      """
      const debug = require('debug')('gubbins')
      debug('hello')
      """
    When I run a scenario with that step
    Then the output should not include "hello"
