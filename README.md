# cucumber-electron

Runs [cucumber-js](https://github.com/cucumber/cucumber-js) in an [electron](https://github.com/electron/electron) renderer process. Scenarios have direct access to both a browser DOM and node.js libraries, so they are fast and easy to debug interactively.

[![Build Status](https://travis-ci.org/cucumber/cucumber-electron.svg?branch=master)](https://travis-ci.org/cucumber/cucumber-electron) [![Build status](https://ci.appveyor.com/api/projects/status/arac0g9l3uj476x3/branch/master?svg=true)](https://ci.appveyor.com/project/joshski/cucumber-electron/branch/master)

## Install

    npm install cucumber-electron --save-dev

## Usage

cucumber-electron is a drop-in replacement for cucumber-js, supporting the same
features and command-line options. You should be able to use it on your project
without any changes, if you have been using cucumber-js 2.0.0

Run cucumber-electron it like it was cucumber-js, for example:

    ./node_modules/.bin/cucumber-electron ./features/your.feature:123


## Debugging

The `--electron-debug` command line switch shows the browser window and keeps
it open after all features have finished running.
