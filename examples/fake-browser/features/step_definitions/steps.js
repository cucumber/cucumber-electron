const { After, Before, Given } = require('@cucumber/cucumber')
const { FakeBrowsers } = require('../../../..')
// When installed as an NPM module, do this instead:
// const { FakeBrowsers } = require('@cucumber/cucumber-electron')

Before(function () {
  this.fakeBrowsers = new FakeBrowsers()
})

After(function () {
  if (!process.env.KEEP_FAKE_BROWSERS) {
    this.fakeBrowsers.destroyAll()
  }
})

Given('{word} has a fake browser with:', function (name, html) {
  const contentElement = this.fakeBrowsers.create(name)
  contentElement.innerHTML = html
})
