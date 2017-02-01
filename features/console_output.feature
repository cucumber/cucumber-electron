Feature: Console output

  Scenario: console output appears in the main process output
    Given a step definition includes the lines:
      """
      console.time()
      console.info('[', 'console.info', ']')
      console.warn('[', 'console.warn', ']')
      console.error('[', 'console.error', ']')
      console.log('[', 'console.log', ']')
      console.log('[', 123, ']')
      console.log('[', undefined, ']')
      console.log('[', null, ']')
      console.log('[', new Date('2000-01-01'), ']')
      console.log('[', new Error('oops'), ']')
      console.log('[', document.body, ']')
      console.log('[', document.createTextNode('banana'), ']')
      console.log('[', { x: document.createTextNode('apple') }, ']')
      console.timeEnd()
      """
    When I run a scenario with that step
    Then stdout should include "[ console.info ]"
    And stderr should include "[ console.warn ]"
    And stderr should include "[ console.error ]"
    And stdout should include "[ console.log ]"
    And stdout should include "[ 123 ]"
    And stdout should include "[ [undefined] ]"
    And stdout should include "[ [null] ]"
    And stdout should include "[ [Date: 2000-01-01T00:00:00.000Z] ]"
    And stdout should include "[ [Error: oops] ]"
    And stdout should include "[ <body /> ]"
    And stdout should include "[ [TextNode: banana] ]"
    And stdout should include "[ { x: [TextNode: apple] } ]"
