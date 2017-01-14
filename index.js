const path = require('path')
const url = require('url')
const electron = require('electron')
const Options = require('./cli/options')

const options = new Options(process.argv)

const app = electron.app
app.commandLine.appendSwitch('--disable-http-cache')

let mainWindow

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    show: options.electronDebug,
    webPreferences: { webSecurity: false }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'renderer', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
    for (const header in d.responseHeaders) {
      if (header.toLowerCase() == 'x-frame-options') {
        delete d[header]
      }
    }
    c({ cancel: false, responseHeaders: d.responseHeaders })
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
