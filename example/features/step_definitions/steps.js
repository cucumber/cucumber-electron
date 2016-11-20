const url = require('url')
const path = require('path')
const app = require('../../app')
const assert = require('assert')

module.exports = function() {
  this.Given(/^I have visited the app$/, function () {
    this.appElement = document.createElement('div')
    document.body.appendChild(this.appElement)
    app.mount(this.appElement)
  })

  this.When(/^I ask it to say something$/, function () {
    this.appElement.querySelector('#saySomething').click()
  })

  this.Then(/^it says hello$/, function () {
    assert.equal('HELLO!', this.appElement.querySelector('#greetings li').innerHTML)
  })

  this.After(function(scenario) {
    if (!scenario.isFailed()) this.appElement.style.display = 'none'
  })
}
