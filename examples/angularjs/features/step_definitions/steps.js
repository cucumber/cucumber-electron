const assert = require("assert")

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
  await angularAppMounted(iframe.contentWindow)
  this.doc = iframe.contentWindow.document
})

After(function () {
  // this.app.frameElement.remove()
})

When("you add the task {string}", function (task) {
  const input = this.doc.querySelector(".new-todo")
  input.value = task

  const form = this.doc.querySelector('.todo-form')
  form.submit()
})

Then("the list of active tasks contains:", function (table) {
  const actualList = [...this.doc.querySelectorAll(".todo-list li")].map(node => node.innerText.trim())
  assert.deepEqual(table.raw(), [actualList])
})
