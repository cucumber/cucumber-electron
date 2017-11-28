const electron = require('electron')

if ('DEBUG' in electron.remote.process.env) {
  const originalProcessType = process.type
  try {
    process.type = 'cucumber-electron'
    const tty = require('tty')
    const originalAtty = tty.isatty
    tty.isatty = fd => {
      if (fd == process.stderr.fd) {
        return true
      }
      return originalAtty(fd)
    }
  } catch (e) {
    process.type = originalProcessType
  }
} else {
  localStorage.debug = ''
}
