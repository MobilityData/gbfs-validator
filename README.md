# GBFS-validator

A General [Bikeshare Feed Specification](https://github.com/NABSA/gbfs) dataset validator

# Introduction

The Canonical GBFS Validator is a tool to check the conformity of a GBFS feed against the [official specification](https://github.com/NABSA/gbfs/blob/master/gbfs.md).
It validates feeds up to version 2.2.
This tool is built using the [JSON Schemas](https://github.com/NABSA/gbfs/blob/master/gbfs.md).

![interface](https://user-images.githubusercontent.com/63653518/134184388-3dca67a5-bd92-4101-bf5e-c6f07f42b44b.png)

Currently, the schemas are reproduced per folder in [gbfs-validator/tree/master/gbfs-validator/schema](https://github.com/fluctuo/gbfs-validator/tree/master/gbfs-validator/schema).

Questions? Please open an issue or reach out to MobilityData on the GBFS slack channel!

# Run the app

The validator is developed to be used “online” (hosted with a lambda function).

1.  Open gbfs-validator.netlify.com/
2.  Enter the feed’s auto-discovery URL
3.  If needed, select the version. If not specified, the validator will pick the version mentioned in the `gbfs.json` file
4.  Select file requirement options (free-floating or docked)
5.  Click the “Valid me” button, and see the validation results below

# Validation rules

The validation rules are listed in [RULES.md](/RULES.md)
Have a suggestion for a new rule? Open an issue!

# Contributing

We welcome contributions to the project! Please check out our [Contribution guidelines](/CONTRIBUTING.md) for details.

# Build the project: Web server install procedure

## Required

To build the project locally, you need

- [Node.js](https://nodejs.org/en/download/) + [Yarn](https://classic.yarnpkg.com/en/docs/install/)

- Ports 8080, 9000 and 9229 need to be free

### Node.js

We recommend you to use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

You should use `v12.x.x` of Node.js, or higher. We recommend `v14.x.x`.

## Clone the repository

```shell
git clone https://github.com/fluctuo/gbfs-validator.git
cd gbfs-validator
```

## Run dev environment

With Node.js

```shell
yarn
yarn start
```

Open `localhost:8080` on your browser

# Acknowledgements
This project was originally created by Pierrick Paul at [fluctuo](https://fluctuo.com/) - MobilityData started maintaining the project in September 2021.
