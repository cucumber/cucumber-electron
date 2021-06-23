const fakeWindow = require('../fakeWindow')

module.exports = class AppElements {
  constructor() {
    /**
     * @private
     */
    this.fakeBrowserWindows = []
  }

  /**
   * Creates a new DOM node that looks like a browser window and adds it to the DOM.
   *
   * @param {Document} document the DOM document
   * @param {string} title the title of the top bar
   * @return {HTMLElement} a DOM node that can be used to mount a DOM application such as a React or Vue element.
   */
  create(document, title) {
    const $fakeBrowserWindow = fakeWindow(document, title, 'cucumber-electron-browser')
    this.fakeBrowserWindows.push($fakeBrowserWindow)
    document.body.appendChild($fakeBrowserWindow)
    return $fakeBrowserWindow.querySelector('.cucumber-electron-window-pane')
  }

  /**
   * Destroys all previously created app elements.
   */
  destroyAll() {
    this.fakeBrowserWindows.forEach(fakeBrowser => fakeBrowser.remove())
  }
}
