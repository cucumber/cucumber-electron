# cucumber-electron 

Runs [cucumber-js](https://github.com/cucumber/cucumber-js) in an [electron](https://github.com/electron/electron) renderer process. Scenarios have direct access to both a browser DOM and node.js libraries, so they run pretty fast.

[![Build Status](https://travis-ci.org/featurist/cucumber-electron.svg?branch=master)](https://travis-ci.org/featurist/cucumber-electron)

## Usage

Run it like it was cucumber-js:
```
cucumber-electron ./example/features/hello.feature:2
```

## Debugging

The `--electron-debug` command line switch shows the browser window and keeps
it open after all features have been run.
