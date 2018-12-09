# CHANGE LOG

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org).

This document is formatted according to the principles of [Keep A CHANGELOG](http://keepachangelog.com).

Please visit [cucumber/CONTRIBUTING.md](https://github.com/cucumber/cucumber/blob/master/CONTRIBUTING.md) for more info on how to contribute to Cucumber.

<!-- Releases -->

### [2.6.0](https://github.com/cucumber/cucumber-electron/compare/v2.5.0...v2.6.0)

* Fix coloured terminal output when using cucumber-js 5.0

### [2.5.0](https://github.com/cucumber/cucumber-electron/compare/v2.4.0...v2.5.0)

* Only disable web security when the environment variable CUCUMBER_ELECTRON_DISABLE_WEB_SECURITY is set to '1'

### [2.4.0](https://github.com/cucumber/cucumber-electron/compare/v2.3.1...v2.4.0)

* Added CLI `--help` option.

* Renamed CLI `--electron-debug` option to `--interactive` (or `-i`)

* Added integration with [debug](https://github.com/visionmedia/debug) module, prints debug messages in the main process

* Fixed an issue with cucumber 4.0.0 where cucumber-electron would always exit with a 0 exit code.

* Added this CHANGELOG.md file per [cucumber/cucumber #251](https://github.com/cucumber/cucumber/issues/251) ([#15](https://github.com/cucumber/cucumber-electron/pull/15) [jaysonesmith](https://github.com/jaysonesmith))

<!-- Contributors -->
[artemave]:       https://github.com/artemave
[aslakhellesoy]:  https://github.com/aslakhellesoy
[jaysonesmith]:   https://github.com/jaysonesmith
[joshski]:        https://github.com/joshski
