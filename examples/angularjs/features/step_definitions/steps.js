const assert = require("assert")
const createBrowser = require('browser-monkey/create')

const {Before, After, When, Then} = require("cucumber")

function mountIframe(path) {
  return new Promise(resolve => {
    const iframe = document.createElement("iframe")
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.onload = () => resolve(iframe)
    iframe.src = path
    document.body.appendChild(iframe)
  })
}

function angularAppMounted(window) {
  return new Promise(resolve =>
    window.angular.element(window.document).ready(() => resolve())
  )
}

Before(async function () {
  const iframe = await mountIframe(__dirname + "/../../index.html")
  this.win = iframe.contentWindow;
  this.win.localStorage.removeItem('todos-angularjs')

  await angularAppMounted(this.win)
  this.browser = createBrowser(this.win.document)
  this.doc = this.win.document
})

After(function (evt) {
  if (evt.result.status === 'passed') {
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
