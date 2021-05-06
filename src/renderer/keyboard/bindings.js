const remote = require('electron').remote

document.body.addEventListener(
  'keydown',
  e => {
    e = e || window.event
    const key = e.which || e.keyCode
    const ctrl = e.ctrlKey ? e.ctrlKey : key === 17
    if (key === 67 && ctrl) remote.process.exit(0)
  },
  false,
)
