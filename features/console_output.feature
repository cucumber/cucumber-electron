Feature: Console output

  Scenario: console output appears on the command line
    Given the file "features/logging.feature" contains:
      """
      Feature: Logging
        Scenario: console.log
          When I log some stuff
      """
    And the file "features/step_definitions/steps.js" contains:
      """
      const { defineSupportCode } = require('cucumber')
      const assert = require('assert')

      defineSupportCode(function ({ When }) {
        When(/^I log some stuff$/, function () {
          console.info("console.info ->", 'info')
          console.warn("console.warn ->", new Date('2000-01-01'))
          console.error("console.error ->", new Error("oops"))
          console.log("console.log ->", 123)
        })
      })
      """
    When I run `cucumber-electron`
    Then the output should include:
      """
        Scenario: console.log
      console.info -> info
      console.warn -> [Date: 2000-01-01T00:00:00.000Z]
      console.error -> [Error: oops]
      console.log -> 123
        ✔ When I log some stuff
      """

  Scenario: console converts DOM nodes to strings
    Given the file "features/logging.feature" contains:
      """
      Feature: Logging an element
        Scenario: console.log converts elements to strings
          When I log DOM nodes
      """
    And the file "features/step_definitions/steps.js" contains:
      """
      const { defineSupportCode } = require('cucumber')
      const assert = require('assert')

      defineSupportCode(function ({ When }) {
        When(/^I log DOM nodes$/, function () {
          const iframe = document.createElement('iframe')
          document.body.appendChild(iframe)
          const textNode = document.createTextNode('hello')
          console.log(document.body, document.head, iframe)
          console.log(textNode, { x: textNode, y: { z: textNode } }, '!')
        })
      })
      """
    When I run `cucumber-electron`
    Then the output should include:
      """
      <body /> <head /> <iframe />
      [TextNode:hello] { x: [TextNode:hello], y: { z: [TextNode:hello] } } !
      """

  Scenario: console does not clobber timeEnd etc
    Given the file "features/logging.feature" contains:
      """
      Feature: Logging timeEnd
        Scenario: console.log converts elements to strings
          When I call console.timeEnd
      """
    And the file "features/step_definitions/steps.js" contains:
      """
      const { defineSupportCode } = require('cucumber')
      const assert = require('assert')

      defineSupportCode(function ({ When }) {
        When('I call console.timeEnd', function () {
          console.log("before")
          console.timeEnd()
          console.log("after")
        })
      })
      """
    When I run `cucumber-electron`
    Then the output should include:
      """
      before
      after
      """
