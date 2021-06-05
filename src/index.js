const { join } = require('path')
const url = require('url')
const { app, ipcMain: ipc, BrowserWindow } = require('electron')
app.commandLine.appendSwitch('--disable-http-cache')

const Options = require('./cli/options')
const options = new Options(process.argv)

global.mainProcessDebug = function ({ namespaces, args }) {
  const debug = require('debug')
  debug.inspectOpts.colors = process.env.DEBUG_COLORS || options.isTTY
  const log = debug(namespaces)
  log(...args)
}

let win

app.whenReady().then(() => {
  win = new BrowserWindow({
    height: 900,
    width: 1000,
    focusable: options.interactiveMode,
    show: false,
    webPreferences: {
      webSecurity: process.env.CUCUMBER_ELECTRON_DISABLE_WEB_SECURITY !== '1',
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  win.webContents.once('did-finish-load', () => {
    if (options.interactiveMode) {
      win.show()
      win.webContents.openDevTools()
      win.webContents.on('devtools-opened', () => {
        // Debugger is not immediately ready
        setTimeout(() => {
          win.webContents.send('run-cucumber')
          // after the first run, reloading the electron window re-runs cucumber
          ipc.on('ready-to-run-cucumber', () => {
            win.webContents.send('run-cucumber')
          })
        }, 250)
      })
    } else {
      win.webContents.send('run-cucumber')
    }
  })

  if (!options.interactiveMode && process.platform === 'darwin') {
    app.dock.hide()
  }

  const indexPath = url.format({
    protocol: 'file',
    slashes: true,
    pathname: join(__dirname, 'renderer/index.html'),
  })
  win.loadURL(indexPath)
})

// in debug mode electron window stays open after ctrc-c
// the code below force quits the window
app.on('before-quit', function () {
  app.exit()
})
