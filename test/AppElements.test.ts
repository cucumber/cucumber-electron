import assert from 'assert'
import { JSDOM } from 'jsdom'
import { AppElements } from '..'

describe('AppElements', () => {
  it('creates an app element', () => {
    const document = new JSDOM('<!DOCTYPE html>').window.document
    const appElements = new AppElements()
    const appElement = appElements.create(document, 'Aslak')
    const fakeBrowserElements = Array.from(document.querySelectorAll('.cucumber-electron-browser'))
    assert.strictEqual(fakeBrowserElements.length, 1)
    assert.strictEqual(appElement, fakeBrowserElements[0])
  })

  it('destroys all app elements', () => {
    const document = new JSDOM('<!DOCTYPE html>').window.document
    const appElements = new AppElements()
    appElements.create(document, 'Aslak')
    appElements.create(document, 'Julien')
    appElements.destroyAll()
    const fakeBrowserElements = Array.from(document.querySelectorAll('.cucumber-electron-browser'))
    assert.strictEqual(fakeBrowserElements.length, 0)
  })
})
