// This is the main entry point for the electron process
const { join, resolve } = require('path')
const { pathToFileURL } = require('url')
const { app, ipcMain: ipc, BrowserWindow } = require('electron')
app.commandLine.appendSwitch('--disable-http-cache')

const Options = require('../cli/options')
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
    ipc.on('cucumber-run-end', (_, code) => app.exit(code))

    if (!options.interactiveMode) {
      win.webContents.send('run-cucumber')
      return
    }

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
  })

  if (!options.interactiveMode && process.platform === 'darwin') {
    app.dock.hide()
  }

  const url = pathToFileURL(join(__dirname, `index.html`))
  if (options.stylesheet) {
    url.searchParams.set('stylesheet', resolve(options.stylesheet))
  }
  const indexPath = url.href
  win.loadURL(indexPath)
})

// in debug mode electron window stays open after ctrc-c
// the code below force quits the window
app.on('before-quit', function () {
  app.exit()
})
