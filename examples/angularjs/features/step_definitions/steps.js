const assert = require("assert")
const createBrowser = require('browser-monkey/create')

const {Before, After, When, Then} = require("cucumber")

Before(async function () {
  // TodoMVC stores TODOs in the browser's localStorage, so we delete that to have a clean slate before each scenario.
  localStorage.removeItem('todos-angularjs')

  // The path to the TODO-MVC index.html page, relative to this file's directory
  const indexHtml = __dirname + "/../../todomvc/index.html";

  // Our index.html needs to be loaded into an empty window, and this is why we're using an iframe.
  // (A more decoupled app could be loaded straight into the current window.document without an iframe - this would be faster).
  const iframe = await mountIframe(indexHtml)
  this.win = iframe.contentWindow
  this.doc = this.win.document
  await angularAppMounted(this.win)

  // Create a browsermonkey object for interacting with the app
  this.browser = createBrowser(this.doc)
})

After(function (evt) {
  if (evt.result.status === 'passed') {
    // Remove the app from the dom if the scenario passed.
    // Failing scenarios leave the iframe intact for post-mortem inspection
    document.body.removeChild(document.body.querySelector('iframe'))
  }
})

When("you add the task {string}", async function (task) {
  const input = this.browser.find('.new-todo')
  await input.typeIn(task)
  await input.submit()
})

Then("the list of active tasks contains:", function (table) {
  const actualList = [...this.doc.querySelectorAll(".todo-list li")].map(node => [node.innerText.trim()])
  assert.deepEqual(table.raw(), actualList)
})

function mountIframe(path) {
  return new Promise(resolve => {
    const iframe = document.createElement("iframe")
    iframe.width = "100%"
    iframe.height = "100%"
    // Wait until the iframe has loaded the HTML
    iframe.onload = () => resolve(iframe)
    iframe.src = path
    document.body.appendChild(iframe)
  })
}

function angularAppMounted(win) {
  return new Promise(resolve =>
    win.angular.element(win.document).ready(() => resolve())
  )
}
