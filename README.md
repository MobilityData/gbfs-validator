# GBFS-validator
A General [Bikeshare Feed Specification](https://github.com/NABSA/gbfs) dataset validator

# Introduction

The Canonical GBFS Validator is a tool to check the conformity of a GBFS feed against the [official specification](https://github.com/NABSA/gbfs/blob/master/gbfs.md).
It validates feeds up to version 2.2.
This tool is built using the [JSON Schemas](https://github.com/NABSA/gbfs/blob/master/gbfs.md).

![interface](https://user-images.githubusercontent.com/63653518/133172186-6842537b-f34c-42bd-bd5a-48ec65a0d8c3.png)

Currently, the schemas are reproduced per folder in [gbfs-validator/tree/master/gbfs-validator/schema](https://github.com/fluctuo/gbfs-validator/tree/master/gbfs-validator/schema).

Questions? Please open an issue or reach out to MobilityData on the gbfs slack channel!

# Run the app
The validator is developed to be used “online” (hosted with a lambda function).
1. Open gbfs-validator.netlify.com/
2. Enter the feed’s auto-discovery URL
3. If needed, select the version. If not specified, the validator will pick the version mentioned in the `gbfs.json` file
4. Select file requirement options (free-floating or docked)
5. Click the “Valid me” button, and see the validation results below

# Validation rules
The validation rules are listed in [RULES.md](/RULES.md)
Have a suggestion for a new rule? Open an issue!

# Contributing
We welcome contributions to the project! Please check out our [Contribution guidelines](/CONTRIBUTING.md) for details.

# Build the project: Web server install procedure
### Required:
1. Ubuntu 20 LTS or similar OS, up-to-date. Not tested under v14 or less.
2. Outside-facing IP address if this needs to be public.
## Table of contents
1. [Install YARN & Node.js](#Install-YARN-&-Node.js)
2. [Check Node.js version](#Check-Node.js-version)
3. [Clone the repository](#Clone-the-repository)
4. [Install dependencies & do some updates](#Install-dependencies-&-do-some-updates)
5. [Install and run with yarn](#Install-and-run-with-yarn)
## Install YARN & Node.js
Import the repository’s GPG key and add the Yarn APT repository to your system by running the following commands:
```shell
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```
Once the repository is enabled, update the package list, and install Yarn.
```shell
sudo apt update
sudo apt install yarn
```
The command above will also install Node.js. If you installed Node trough nvm, skip the Node.js installation with:
```shell
sudo apt install --no-install-recommends yarn
```
Once completed, verify the installation by printing the Yarn version:
```shell
yarn --version
```
The output will look something like this:
```
1.22.5
```
The version installed on your system may differ from the one shown above.
## Check Node.js version
You should use `v12.13.0` of Node.js, or higher. We reccomend `v14.x.x`. Check which version is installed by Yarn:
```shell
node -v
```
If the version is too old, install version 14 like this:
```shell
cd ~
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs -y
```
Check the version again to confirm:
```shell
node -v
```
## Clone the repository
```shell
mkdir /var/www/html/ && cd /var/www/html/
git clone https://github.com/fluctuo/gbfs-validator.git
cd /var/www/html/gbfs-validator
```
## Install dependencies & do some updates
```shell
yarn add jquery -W
yarn add webpack@4.46.0 -W
yarn add @popperjs/core -W
yarn upgrade caniuse-lite browserslist
```
## Install and run with yarn
```shell
yarn
yarn start
```
Either use `localhost:8080` or your public-f
