const { join, resolve } = require('path')
const window = require('electron-window')
const { app } = require('electron')
app.commandLine.appendSwitch('--disable-http-cache')

const Options = require('./cli/options')
const options = new Options(process.argv)

app.on('ready', () => {
  const win = window.createWindow({
    height: 800,
    width: 600,
    focusable: options.electronDebug,
    show: options.electronDebug,
    webPreferences: { webSecurity: false }
  })

  if (!options.electronDebug && process.platform === 'darwin') {
    app.dock.hide()
  }

  const indexPath = resolve(join(__dirname, 'renderer/index.html'))
  // undocumented call in electron-window
  win._loadURLWithArgs(indexPath, {}, () => {})
})

process.on('SIGINT', function () {
  process.exit(1)
})
