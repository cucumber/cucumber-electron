# cucumber-electron

Runs cucumber-js in an electron renderer process, meaning cucumber scenarios
have direct access to both a browser DOM and node.js stuff.

## Usage

Use it like cucumber-js:
```
cucumber-electron ./example/features/hello.feature:2
```
