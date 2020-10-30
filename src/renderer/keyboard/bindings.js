const electron = require('electron')

document.body.addEventListener('keydown', e => {
  e = e || window.event
  const key = e.which || e.keyCode
  const ctrl = e.ctrlKey ? e.ctrlKey : key === 17
  if (key === 67 && ctrl) electron.remote.process.exit(0)
}, false)
