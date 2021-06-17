module.exports = class AppElements {
  constructor() {
    /**
     * @private
     */
    this.fakeBrowserElements = []
  }

  /**
   * Creates a new DOM node that looks like a browser window and adds it to the DOM.
   *
   * @param {Document} document the DOM document
   * @param {string} title the title of the top bar
   * @return {Element} a DOM node that can be used to mount a DOM application such as a React or Vue element.
   */
  create(document, title) {
    const fakeBrowserElement = document.createElement('div')
    this.fakeBrowserElements.push(fakeBrowserElement)
    fakeBrowserElement.innerHTML = `<div class="cucumber-electron-fake-browser">
      <div class="cucumber-electron-fake-browser-top">
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-red"></span>
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-orange"></span>
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-green"></span>
        <span class="cucumber-electron-fake-browser-title"></span>
      </div>
      <div class="cucumber-electron-fake-browser-content"></div>
    </div>`
    fakeBrowserElement.querySelector('span.cucumber-electron-fake-browser-title').innerText = title
    document.body.appendChild(fakeBrowserElement)
    const appElement = fakeBrowserElement.querySelector(
      'div.cucumber-electron-fake-browser-content',
    )
    return appElement
  }

  /**
   * Destroys all previously created app elements.
   */
  destroyAll() {
    this.fakeBrowserElements.forEach(fakeBrowser => fakeBrowser.remove())
  }
}
