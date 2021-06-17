const { After, Before, Given } = require('@cucumber/cucumber')
const { AppElements } = require('../../../..')
// When installed as an NPM module, do this instead:
// const { AppElements } = require('@cucumber/cucumber-electron')

Before(function () {
  this.appElements = new AppElements()
})

After(function () {
  if (!process.env.CUCUMBER_ELECTRON_KEEP_APP_ELEMENTS) {
    this.appElements.destroyAll()
  }
})

Given('{word} has an app element with:', function (name, html) {
  const contentElement = this.appElements.create(document, name)
  contentElement.innerHTML = html
})
