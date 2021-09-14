We welcome contributions to the project!
# How to contribute to the project?
All contributions to this project are welcome. To propose changes, we encourage contributors to:

1. Fork this project on GitHub
2. Create a new branch
3. Propose  changes by opening a new pull request.
If you're looking for somewhere to start, check out the issues labeled "Good first issue" or Community.

# Issue and PR templates
We encourage contributors to format pull request titles following the [Conventional Commit Specification] (https://www.conventionalcommits.org/en/v1.0.0/).

# Folder organization
- gbfs-validator

This is the heart of the validator. This folder contains a NodeJs package to validate GBFS Feeds.

- gbfs-validator/schema

Contains JSON schemas

- website

Contains the frontend, currently hosted by Netlify on https://gbfs-validator.netlify.app/
It’s a tiny Vue SPA.

- functions

The API for the website uses a “lambda function”.
This folder contains the lambda function. The function will depend on the gbfs-validator package.
The function is only compatible with Netlify Function (https://www.netlify.com/products/functions/) for now.

- check-systems

Check-systems is a CLI tool to validate the whole “systems.csv” from https://github.com/NABSA/gbfs locally

# Code convention
"Sticking to a single consistent and documented coding style for this project is important to ensure that code reviewers dedicate their attention to the functionality of the validation, as opposed to disagreements about the coding style (and avoid bike-shedding https://en.wikipedia.org/wiki/Law_of_triviality )." This project uses the Eslint + Prettier to ensure lint (See .eslintrc.js and .prettierrc)

# Adding a new version
For adding a new version:
- Create a new folder under “gbfs-validator/schema” with the version as name (Eg: “vX.Y”).
- Add an “index.js” file. This file will define the possible JSON-schema to call for validation and the mandatory ones. See https://github.com/fluctuo/gbfs-validator/blob/master/gbfs-validator/schema/v2.2/index.js for an exemple
- Fill the folder with all JSON-schemas for this version
- Add an item on this array (https://github.com/fluctuo/gbfs-validator/blob/master/website/src/components/Validator.vue#L98) with the new version to be made available on the website.
