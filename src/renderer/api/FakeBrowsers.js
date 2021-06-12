module.exports = class FakeBrowsers {
  constructor() {
    this.fakeBrowsers = []
  }

  /**
   * Creates a new fake browser element and adds it to the DOM.
   *
   * @param title the title of the top bar
   * @return the element in the fake browser's content section
   */
  create(title) {
    const fakeBrowser = document.createElement('div')
    this.fakeBrowsers.push(fakeBrowser)
    fakeBrowser.innerHTML = `<div class="cucumber-electron-fake-browser">
      <div class="cucumber-electron-fake-browser-top">
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-red"></span>
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-orange"></span>
        <span class="cucumber-electron-fake-browser-dot cucumber-electron-fake-browser-green"></span>
        <span class="cucumber-electron-fake-browser-title"></span>
      </div>
      <div class="cucumber-electron-fake-browser-content"></div>
    </div>`
    fakeBrowser.querySelector('span.cucumber-electron-fake-browser-title').innerText = title
    document.body.appendChild(fakeBrowser)
    const appElement = fakeBrowser.querySelector('div.cucumber-electron-fake-browser-content')
    return appElement
  }

  /**
   * Destroys all previously created fake browsers.
   */
  destroyAll() {
    this.fakeBrowsers.forEach(fakeBrowser => fakeBrowser.remove())
  }
}
