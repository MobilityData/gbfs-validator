# GBFS-validator

[![All Contributors](https://img.shields.io/github/all-contributors/MobilityData/gbfs-validator?color=blue&style=flat)](#contributors)

A [General Bikeshare Feed Specification](https://github.com/MobilityData/gbfs) dataset validator

## Introduction

The Canonical GBFS Validator is a tool to check the conformity of a GBFS feed against the [official specification](https://github.com/MobilityData/gbfs/blob/master/gbfs.md).
It validates feeds up to GBFS version 3.0.
This tool is built using the [JSON Schemas](https://github.com/MobilityData/gbfs-json-schema), and the site is powered by [Netlify](https://www.netlify.com/).

![interface](https://github.com/MobilityData/gbfs-validator/assets/2423604/11206e7a-dd64-4133-bb32-eaa391815e60)

The schemas in `gbfs-validator/versions/schemas` is a git subtree of https://github.com/MobilityData/gbfs-json-schema. For more details, see [`gbfs-validator/versions/schemas/README.md`](https://github.com/MobilityData/gbfs-validator/tree/master/gbfs-validator/versions).

Questions? Please open an issue or reach out on the #gbfs channel on the [MobilityData Slack](https://mobilitydata-io.slack.com/).

## Run the app

The validator is developed to be used “online” (hosted with a lambda function).

1.  Open https://gbfs-validator.mobilitydata.org
2.  Enter the feed’s auto-discovery URL
3.  If needed, select the version. If not specified, the validator will pick the version mentioned in the `gbfs.json` file
4.  Select file requirement options (free-floating or docked)
5.  Click the “Validate me !” button, and see the validation results below

## Validation rules

The validation rules are listed in [RULES.md](/RULES.md)
Have a suggestion for a new rule? Open an issue!

## Build the project: Web server install procedure

### Required

To build the project locally, you need:

- [Node.js](https://nodejs.org/en/download/). Minimum Node.js version `v14.x.x`, or higher. Recommend Node.js version `v18.x.x`.
```shell
brew install node
```

- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
```shell
npm install --global yarn
```

- Ports 8080, 9000 and 9229 need to be free

### Run dev environment

- Download or clone the repository
```shell
git clone https://github.com/MobilityData/gbfs-validator.git
cd gbfs-validator
```

- Install the requirements
```shell
yarn
```

- Connect your local project to the `gbfs-validator` Netlify site to access its environment variables
```shell
netlify link
```
Select `Enter the site name` and enter `gbfs-validator`

- Run dev environment locally
```shell
yarn run dev
```

- Open `localhost:8080` on your browser

### Command line
The GBFS validator can be used as a Command Line Interface (CLI):

- Download or clone the repository
```shell
git clone https://github.com/MobilityData/gbfs-validator.git
cd gbfs-validator
```

- Execute the CLI script
```shell
node ./gbfs-validator/cli.js -u {http_address_of_gbfs_dataset} -s {local_path_to_output_report_file}
```

- To get the list of supported paramters
```shell
node ./gbfs-validator/cli.js --help
```

- Usage description and supported parameters
```
Usage: cli [OPTIONS]...

Options:
  -v, --version                    output the version number
  -u, --url <feed_url>             URL of the GBFS feed
  -vb, --verbose                   Verbose mode prints debugging console logs
  -s, --save-report <report_path>  Local path to output report file
  -pr, --print-report <yes_no>     Print report to standard output (choices: "yes", "no", default: "yes")
  -h, --help                       display help for command
```

### Npm package
The gbfs-validator Node.js npm package is now accessible for integration into your projects. To learn how to install and utilize it effectively, please refer to the [README](./gbfs-validator/README.md) for comprehensive guidance.

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

## OpenAPI Specification

:warning: **Subject to change**: This OpenAPI specification may change at any time. We do not recommend building any production systems that depend on this API directly.

The OpenAPI specification can be viewed at: https://mobilitydata.github.io/gbfs-validator/SwaggerUI/index.html.

## Acknowledgments

This project was originally created by Pierrick Paul ([@PierrickP](https://github.com/PierrickP)) at [fluctuo](https://fluctuo.com/) - MobilityData started maintaining the project in September 2021.
