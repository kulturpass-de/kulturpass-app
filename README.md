<p align="center">
    <img src="https://github.com/kulturpass-de/.github/blob/main/images/kulturpass-de-logo.jpg?raw=true">
<p>
<h1 align="center">
KulturPass: App
</h1>
<p align="center">
<a href="https://github.com/kulturpass-de/kulturpass-app/issues" title="Issues"><img src="https://img.shields.io/github/issues/kulturpass-de/kulturpass-app?style=flat"></a>
<a href="https://github.com/kulturpass-de/kulturpass-app/blob/HEAD/LICENSEs" title="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat"></a>
<a href="https://api.reuse.software/info/github.com/kulturpass-de/kulturpass-app" title="REUSE status"><img src="https://api.reuse.software/badge/github.com/kulturpass-de/kulturpass-app"></a>
</p>

<p align="center">
  <a href="#about-this-project">About this Project</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#installation">Installation</a> •
  <a href="#troubleshooting">Troubleshooting</a> •
  <a href="#updating-commerce-webservices-types">Updating Commerce Webservices Types</a> •
  <a href="#support-feedback-contributing">Support, Feedback, Contributing</a> •
  <a href="#code-of-conduct">Code of Conduct</a> •
  <a href="#licensing">Licensing</a>
</p>


## About this project

The KulturPass in Germany is implemented by resolution of the German Bundestag and is the responsibility of the Federal Government Commissioner for Culture and the Media (BKM). The main objective of the project is compensation in both ways: On the one hand to support the cultural community in the broadest sense; artists, agencies, stages, and cultural providers, and on the other hand to motivate, encourage, and inspire young interested people to actively discover, experience, and explore culture and art. To achieve this goal, with the KulturPass we aim to create a "cultural marketplace" with offerings for the youth. Those cultural offers can be found and reserved leveraging a KulturPass app on the smartphone with a monetary budget funded by the German government. Visit our [website](https://kulturpass.de) for more information.

You can find the architecture overview [here](https://github.com/kulturpass-de/kulturpass-documentation), which will give you a good starting point in how the services interact with other services, and what purpose they serve.

This project uses:
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/home.html)

## Requirements
These instructions presume a macOS installation.

Check required dependencies and versions using

    $ yarn solidarity --verbose
    $ yarn solidarity report

Install react native dependencies as described in [environment setup](https://reactnative.dev/docs/environment-setup)

Recommendations:
- using brew for installing basic dependencies
- using [asdf](https://asdf-vm.com/) for node & rvm versions

## Installation
    $ yarn install

    $ cd ios
    $ bundle install
    $ yarn podinstall

## Troubleshooting

    Problem when running `yarn ios`: `error: no such module 'AusweisApp2'`
    Solution1: `yarn ausweisapp2-fix-postinstall`
    Solution2: `yarn reinstall`

    Problem: Flipper crashes the app on a simulator
    Solution:
      install Flipper 0.186.0 (tip: renaming the application binary to Flipper-0.186.0 allows to install different version of flipper side by side)
      open App (and make sure flipper is closed at this step)
      open Flipper


## Updating Commerce Webservices Types

A lot of Models used throughout this project are defined by the backend/api. In order to fetch the Types of those Models, use the following command

```
yarn types:commerce
```

And correct any occuring errors in the generated file `src/services/api/types/commerce/api-types.ts`

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/kulturpass-de/kulturpass-app/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2023 SAP SE or an SAP affiliate company and kulturpass-app contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/kulturpass-de/kulturpass-app).
