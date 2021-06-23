/**
 * Creates a new DOM node that looks like a window and adds it to the DOM.
 *
 * @param {Document} document the DOM document
 * @param {string} title the title of the top bar
 * @param {string} paneClass CSS class to add to the window pane
 * @return {HTMLElement} a DOM node that can be used to mount a DOM application such as a React or Vue element.
 */
module.exports = function fakeWindow(document, title, paneClass) {
  const $fakeWindow = document.createElement('div')
  $fakeWindow.className = 'cucumber-electron-window'
  $fakeWindow.innerHTML = `
    <div class="cucumber-electron-window-top">
      <span class="cucumber-electron-window-top-dot cucumber-electron-window-top-red"></span>
      <span class="cucumber-electron-window-top-dot cucumber-electron-window-top-orange"></span>
      <span class="cucumber-electron-window-top-dot cucumber-electron-window-top-green"></span>
      <span class="cucumber-electron-window-top-title"></span>
    </div>
    <div class="cucumber-electron-window-pane ${paneClass}"></div>
  `
  $fakeWindow.querySelector('span.cucumber-electron-window-top-title').innerText = title
  return $fakeWindow
}
