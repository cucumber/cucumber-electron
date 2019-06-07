# cucumber-electron

Runs [cucumber-js](https://github.com/cucumber/cucumber-js) in an [electron](https://github.com/electron/electron) renderer process. Scenarios have direct access to both a browser DOM and node.js libraries, so they are fast and easy to debug interactively.

[![Build Status](https://travis-ci.org/cucumber/cucumber-electron.svg?branch=master)](https://travis-ci.org/cucumber/cucumber-electron) [![Build status](https://ci.appveyor.com/api/projects/status/arac0g9l3uj476x3/branch/master?svg=true)](https://ci.appveyor.com/project/joshski/cucumber-electron/branch/master)

## Install

    npm install electron cucumber-electron --save-dev

## Usage

cucumber-electron is a drop-in replacement for cucumber-js, supporting the same
features and command-line options. You should be able to use it on your project
without any changes.

Run cucumber-electron like it was cucumber-js, for example:

    ./node_modules/.bin/cucumber-electron ./features/your.feature:123


## Interactive Debugging

The `--interactive` (or `-i`) command line switch shows a browser window with chrome dev tools and keeps
the window open after all features have finished running.

The interactive debugger will halt execution on any `debugger` statements, or breakpoints you have set in chrome dev tools.
