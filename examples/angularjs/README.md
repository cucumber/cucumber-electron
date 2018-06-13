# Cucumber-Electron with AngularJS Example

This project uses Cucumber-Electron to automate [TodoMVC / AngularJS](http://todomvc.com/examples/angularjs/).

Install dependencies:

    # Install the app's dependencies
    cd todomvc
    npm install

    # Install testing dependencies
    cd ..
    npm install

Run Cucumber-Electron:

    npm test

Run Cucumber-Electron interactively

    ./node_modules/.bin cucumber-electron --interactive

In interactive mode, just press CMD-R (MacOS) or CTRL-R (Windows) to re-run.

## How it works

Cucumber-Electron makes a browser environment available from Node.js. The step definitions
mount the app in an iframe, then uses [browser-monkey](https://github.com/featurist/browser-monkey) 
to simulate a user adding TODOs. Browser-monkey makes it easier to simulate DOM events than doing
it "by hand".

See `features/step_definitions/steps.js` for more details.