const http = require('http')
const assert = require('assert')

class WebApps {
  stop() {
    if (this.webAppServer) {
      return new Promise((resolve, reject) => {
        this.webAppServer.close(function (e) {
          e ? reject(e) : resolve()
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  runWebApp() {
    let session = 1
    return new Promise((resolve, reject) => {
      this.webAppServer = http.createServer((req, res) => {
        if (req.url == '/') {
          res.writeHead(302, {
            'Set-Cookie': ['session=' + (session++) + '; expires=0; path=/;"'],
            'Connection': 'close',
            'Location': '/content'
          })
          res.end()
        } else if (req.url == '/content') {
          res.writeHead(200, {
            'Content-Type': 'text/html',
            'Connection': 'close',
          })
          res.end('<script>document.write(document.cookie)</' + 'script>')
        } else {
          res.writeHead(404)
          res.end()
        }
      })
      this.webAppServer.listen(8666, error => {
        error ? reject(error) : resolve()
      })
    })
  }

  loadWebAppInIFrame(url) {
    const frame = document.createElement('iframe')
    frame.src = url
    document.body.appendChild(frame)
    document.body.appendChild(document.createElement('br'))
    return new Promise(function (resolve) {
      frame.onload = function () {
        resolve(frame)
      }
    })
  }

  reloadFrame(frame) {
    return new Promise(function (resolve) {
      frame.onload = function () {
        resolve()
      }
      frame.contentWindow.location.reload()
    })
  }

  assertFrameIsInSession(frame, session) {
    assert.equal(frame.contentDocument.body.innerText, 'session=' + session)
  }
}

module.exports = WebApps
