const path = require("path");
const assert = require("assert");

const { Before, After, When, Then } = require("cucumber");

const absoluteIndexPath = indexPath => path.join(process.cwd(), indexPath);

const relativeIndexPath = indexPath =>
  path.relative(
    require.resolve("cucumber-electron"),
    absoluteIndexPath(indexPath)
  );

const mountApp = async indexPath =>
  new Promise(resolve => {
    const node = document.createElement("iframe");
    node.width = "100%"
    node.height = "100%"
    node.onload = () => resolve(node);
    node.src = relativeIndexPath(indexPath);
    document.body.appendChild(node);
  });

Before(async function() {
  const frame = await mountApp("./index.html");
  this.app = frame.contentWindow;
  return new Promise(resolve =>
    this.app.angular.element(this.app.document).ready(() => resolve())
  );
});

After(function() {
  // this.app.frameElement.remove()
});

const Fill = {
  in: input => ({
    with: text => {
      console.log(text);
      console.log(text.length);
      for (var i = 0; i < text.length; i++) {
        Fill.in(input).withCode(text.charCodeAt(i))
      }
    },
    withCode: keyCode => {
      console.log(keyCode, input)
      const ev = this.app.document.createEvent("Event");
      ev.initEvent("keydown");
      ev.which = ev.keyCode = keyCode;
      input.dispatchEvent(ev);
    }
  }),
};

const createKeyPressEvent = character => {
  const keyCode = character.charCodeAt(0)
  const ev = this.app.document.createEvent("Event");
  ev.initEvent("keypress");
  ev.which = ev.keyCode = keyCode;
  return ev
}

When("you add the task {string}", function(string) {
  const input = this.app.document.querySelector(".new-todo");
  for(var character of string) {
    const event = createKeyPressEvent(character)
    input.dispatchEvent(event)
    console.log(char)
  }
  Fill.in(input).withCode(13)
});

Then("the list of active tasks contains:", function(table) {
  const actualList = Array.from(
    this.app.document.querySelectorAll(".todo-list li")
  ).map(node => node.innerText.trim());
  assert.deepEqual(table.raw(), [actualList]);
});
