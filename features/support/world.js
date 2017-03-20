const os = require('os')

const worlds = [
  require('./worlds/processes'),
  require('./worlds/webApps')
]

const { defineSupportCode } = require('cucumber')

function CucumberElectronWorld() {
  this.worlds = worlds.map(World => {
    const world = new World()
    for (let key of Reflect.ownKeys(Reflect.getPrototypeOf(world))) {
      if (['constructor', 'start', 'stop'].indexOf(key) == -1) {
        this[key] = world[key]
      }
    }
    for (let key in world) {
      this[key] = world[key]
    }
    return world
  })
}

CucumberElectronWorld.prototype.startWorlds = function () {
  return Promise.all(this.worlds.map(world => {
    return world.start ? world.start.apply(this) : Promise.resolve()
  }))
}

CucumberElectronWorld.prototype.stopWorlds = function () {
  return Promise.all(this.worlds.map(world => {
    return world.stop ? world.stop.apply(this) : Promise.resolve()
  }))
}

defineSupportCode(function ({ setWorldConstructor, setDefaultTimeout, Before, After }) {
  if (os.platform() === 'win32') {
    setDefaultTimeout(15000)
  }

  setWorldConstructor(CucumberElectronWorld)

  Before(function () { return this.startWorlds() })
  After(function () { return this.stopWorlds() })
})
