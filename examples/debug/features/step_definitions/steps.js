const { Given } = require('cucumber')
const debug = require('debug')('sausages')

Given('I am getting old', function () {
  debug('a %s and a %o', 'string', {
    object: { with: { x: 1, y: new Date() } }
  })
})
