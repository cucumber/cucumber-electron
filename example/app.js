module.exports = {
  mount: function(element) {
    var greetings = document.createElement('ul')
    greetings.id = 'greetings'

    var button = document.createElement('button')
    button.id = 'saySomething'
    button.innerHTML = 'Say Something!'
    button.onclick = function(event) {
      var greeting = document.createElement('li')
      greeting.innerHTML = 'HELLO!'
      greetings.appendChild(greeting)
    }

    element.appendChild(button)
    element.appendChild(greetings)
  }
}
