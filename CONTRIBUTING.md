# Contributing to Cucumber-Electron

## Making changes

* Use TDD
* Update `CHANGELOG.md` when you make a significant change

## Release process

_The following is a checklist for maintainers when preparing a new release_

### Major releases

We will always make a release candidate before issuing a major release. The release candidate will be available for at least a month to give users
time to validate that there are no unexpected breaking changes.

### Process

The release is done from the [cucumber-build](https://github.com/cucumber/cucumber-build/) docker container. This makes
sure we use the same environment for all releases.

**Every command should be run from within the Docker container**.

Start the container:

    make docker-run

Inside the container, update dependencies:

    npm run update-dependencies
    npm install
    npm test

If the tests fail, update your code to be compatible with the new libraries, or revert the library upgrades that break the build.

* Add missing entries to `CHANGELOG.md`
  * Ideally the CHANGELOG should be up-to-date, but sometimes there will be accidental omissions when merging PRs. Missing PRs should be added.
  * Describe the major changes introduced. API changes must be documented. In particular, backward-incompatible changes must be well explained, with examples when possible.
  * `git log --format=format:"* %s (%an)" --reverse <last-version-tag>..HEAD` might be handy.
* Update the contributors list in `package.json`
  * `git log --format=format:"%an <%ae>" --reverse <last-version-tag>..HEAD  | grep -vEi "(renovate|dependabot|Snyk)" | sort| uniq -i`
  * Manually add contributors (in alphabetical order)

[Decide what the next version should be](https://github.com/cucumber/cucumber/blob/master/RELEASE_PROCESS.md#decide-what-the-next-version-should-be).

Update CHANGELOG links:

    NEW_VERSION=<major.minor.patch(-rc.X)> make update-changelog

Verify changes to the CHANGELOG are correct. Stage uncommitted changes:

    git add .
    git commit -am "Release <major.minor.patch(-rc.X)>"

Then bump the version number and create a git tag. Run *one* of the following:

    # Major prelease
    npm version premajor --preid=rc

    # Major release
    npm version major

    # Minor release
    npm version minor

    # Patch release
    npm version patch

Publish to npm:

    npm publish --access public

Push to git:

    git push
    git push --tags