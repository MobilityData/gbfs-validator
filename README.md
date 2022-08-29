# GBFS-validator

[![All Contributors](https://img.shields.io/github/all-contributors/MobilityData/gbfs-validator?color=blue&style=flat)](#contributors)

A [General Bikeshare Feed Specification](https://github.com/MobilityData/gbfs) dataset validator

## Introduction

The Canonical GBFS Validator is a tool to check the conformity of a GBFS feed against the [official specification](https://github.com/MobilityData/gbfs/blob/master/gbfs.md).
It validates feeds up to GBFS version 2.3.
This tool is built using the [JSON Schemas](https://github.com/MobilityData/gbfs-json-schema), and the site is powered by [Netlify](https://www.netlify.com/).

![interface](https://user-images.githubusercontent.com/63653518/138286224-b0b23dca-d87e-45e8-b58a-e6a4a37ad773.png)

The schemas in `gbfs-validator/versions/schemas` is a git subtree of https://github.com/MobilityData/gbfs-json-schema. For more details, see [`gbfs-validator/versions/schemas/README.md`](https://github.com/MobilityData/gbfs-validator/tree/master/gbfs-validator/versions).

Questions? Please open an issue or reach out to MobilityData on the GBFS slack channel!

## Run the app

The validator is developed to be used “online” (hosted with a lambda function).

1.  Open gbfs-validator.mobilitydata.org/
2.  Enter the feed’s auto-discovery URL
3.  If needed, select the version. If not specified, the validator will pick the version mentioned in the `gbfs.json` file
4.  Select file requirement options (free-floating or docked)
5.  Click the “Valid me” button, and see the validation results below

## Validation rules

The validation rules are listed in [RULES.md](/RULES.md)
Have a suggestion for a new rule? Open an issue!

## Build the project: Web server install procedure

### Required

To build the project locally, you need

- [Node.js](https://nodejs.org/en/download/) + [Yarn](https://classic.yarnpkg.com/en/docs/install/)

- Ports 8080, 9000 and 9229 need to be free

#### Node.js

We recommend you to use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

Minimum Node.js version `v14.x.x`, or higher. Recommend Node.js version `v18.x.x`.

### Clone the repository

```shell
git clone https://github.com/fluctuo/gbfs-validator.git
cd gbfs-validator
```

### Run dev environment

With Node.js

```shell
yarn
yarn start
```

Open `localhost:8080` on your browser

## Projects based on this validator

[transport.data.gouv.fr GBFS validator tool](https://transport.data.gouv.fr/validation?type=gbfs) - Tool displaying interactive geofencing, station, and vehicle maps, the validation results, and metadata of GBFS feeds.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org/docs/en/overview) specification, find the [emoji key here](https://allcontributors.org/docs/en/emoji-key). Contributions of any kind welcome! Please check out our [Contribution guidelines](/CONTRIBUTING.md) for details.

:warning: for contributions on schemas, please see [Versions README](gbfs-validator/versions/README.md)

## Acknowledgements

This project was originally created by Pierrick Paul at [fluctuo](https://fluctuo.com/) - MobilityData started maintaining the project in September 2021.
