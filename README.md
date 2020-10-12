# cucumber-electron

Runs [Cucumber.js](https://github.com/cucumber/cucumber-js) in an [Electron](https://github.com/electron/electron) renderer process. Scenarios have direct access to both a browser DOM and node.js libraries, so they are fast and easy to debug interactively.

[![Build Status](https://github.com/cucumber/cucumber-electron/workflows/build/badge.svg)](https://github.com/cucumber/cucumber-electron/actions)

## Install

Both Electron and Cucumber.js need to be installed, they are peer dependencies.
This gives you the option to choose the version you want to use:

    npm install --save-dev electron @cucumber/cucumber @cucumber/electron

## Usage

Cucumber-electron is a wrapper around Cucumber.js, supporting the same
features and command-line options. You should be able to use it on your project
without any changes.

Run cucumber-electron like it was Cucumber.js, for example:

    npx cucumber-electron ./features/your.feature:123


## Interactive Debugging

The `--interactive` (or `-i`) command line switch shows a browser window with chrome dev tools and keeps
the window open after all features have finished running.

The interactive debugger will halt execution on any `debugger` statements, or breakpoints you have set in chrome dev tools.
