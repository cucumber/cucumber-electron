const electron = require('electron')
const remoteConsole = electron.remote.getGlobal('console')

const localConsole = console

global.console = {
  log() {
    const args = Array.prototype.slice.apply(arguments)
    localConsole.log.apply(localConsole, args)
    remoteConsole.log.apply(remoteConsole, args)
  }
}
