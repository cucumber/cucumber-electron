const electron = require('electron')
const cli = require('./cli')(process.argv)
const app = electron.app
app.commandLine.appendSwitch('--disable-http-cache')

const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: !!cli.electronDebug,
    webPreferences: { webSecurity: false }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
    hash: encodeURIComponent(JSON.stringify(process.argv.slice(2)))
  }))

  mainWindow.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
    if(d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']){
        delete d.responseHeaders['x-frame-options'];
        delete d.responseHeaders['X-Frame-Options'];
    }
    c({cancel: false, responseHeaders: d.responseHeaders});
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
