# CHANGE LOG

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org).

This document is formatted according to the principles of [Keep A CHANGELOG](http://keepachangelog.com).

Please visit [cucumber/CONTRIBUTING.md](https://github.com/cucumber/cucumber/blob/master/CONTRIBUTING.md) for more info on how to contribute to Cucumber.

----
## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

## [4.0.0] - 2021-06-07

### Changed

* Use both stdout and stderr

### Removed

* Remove dependency on electron-window package
* Remove support for Node.js < 12
* Remove support for Electron < 12

### Fixed

* Fix support for Cucumber.js 7.2.1

## [v3.0.0] - 2020-12-21

* Depends on Cucumber.js 7.0.0 and above.
* The peer dependency on Electron has been relaxed: all versions below 12 are now allowed. This will allow you to use a recent version of Electron before we bump it in Cucumber-electron's dependencies :)

## [v3.0.0-rc.1] - 2020-12-02

* Both Cucumber.js' and Cucumber-electron's versions are now displayed when using `--version` and the process properly exits
* Unknown CLI options are no longer making Cucumber-electron hang in non-interactive mode
* Uncaught exceptions thrown in the Cucumber CLI process — including compile errors like syntax errors and failed requires — are now properly caught and reported before making the process exit with status 3
* Electron 11 is now officially supported

## [v3.0.0-rc.0] - 2020-10-16

* Cucumber-electron now depends on [@cucumber/cucumber-7.0.0-rc.0](https://www.npmjs.com/package/@cucumber/cucumber) and above (not backward-compatible with previous versions) as an explicit peer dependency. You need to install it alongside cucumber-electron in your project.
* Electron is also now an explicit peer dependency. Versions from 8.2.0 to 10 are supported. This gives you more freedom if you also use Electron in your app.
* We now [officially support Node.js v14](https://github.com/cucumber/cucumber-electron/actions?query=workflow%3Abuild) (in addition to 8, 10 and 12).

## [v2.7.1] - 2020-04-02

* Add `<!DOCTYPE html>` to avoid quirks mode
* Change package name from `cucumber-electron` to `@cucumber/electron`
* Upgrade dependencies
* Switch from `yarn.lock` to `package-lock.json`

## [2.7.0] - 2019-06-07

* Support for electron 5 and node 12

## [2.6.0] - 2018-12-09

* Fix coloured terminal output when using cucumber-js 5.0

## [2.5.0] - 2018-06-07

* Only disable web security when the environment variable CUCUMBER_ELECTRON_DISABLE_WEB_SECURITY is set to '1'

## [2.4.0] - 2018-02-20

* Added CLI `--help` option.

* Renamed CLI `--electron-debug` option to `--interactive` (or `-i`)

* Added integration with [debug](https://github.com/visionmedia/debug) module, prints debug messages in the main process

* Fixed an issue with cucumber 4.0.0 where cucumber-electron would always exit with a 0 exit code.

* Added this CHANGELOG.md file per [cucumber/cucumber #251](https://github.com/cucumber/cucumber/issues/251) ([#15](https://github.com/cucumber/cucumber-electron/pull/15) [jaysonesmith](https://github.com/jaysonesmith))

<!-- Releases -->
[Unreleased]: https://github.com/cucumber/cucumber-electron/compare/v4.0.0...main
[4.0.0]:      https://github.com/cucumber/cucumber-electron/compare/v3.0.0...v4.0.0
[3.0.0]:      https://github.com/cucumber/cucumber-electron/compare/v3.0.0-rc1...v3.0.0
[3.0.0-rc1]:  https://github.com/cucumber/cucumber-electron/compare/v3.0.0-rc0...v3.0.0-rc1
[3.0.0-rc0]:  https://github.com/cucumber/cucumber-electron/compare/v2.7.1...v3.0.0-rc0
[2.7.1]:      https://github.com/cucumber/cucumber-electron/compare/v2.7.0...v2.7.1
[2.7.0]:      https://github.com/cucumber/cucumber-electron/compare/v2.6.0...v2.7.0
[2.6.0]:      https://github.com/cucumber/cucumber-electron/compare/v2.5.0...v2.6.0
[2.5.0]:      https://github.com/cucumber/cucumber-electron/compare/v2.4.0...v2.5.0
[2.4.0]:      https://github.com/cucumber/cucumber-electron/releases/tag/v2.4.0

<!-- Contributors -->
[artemave]:       https://github.com/artemave
[aslakhellesoy]:  https://github.com/aslakhellesoy
[jaysonesmith]:   https://github.com/jaysonesmith
[jbpros]:         https://github.com/jbpros
[joshski]:        https://github.com/joshski
[romaingweb]:     https://github.com/romaingweb
