This project validates feeds up to version 2.2 of the [JSON Schemas](https://github.com/NABSA/gbfs/blob/master/gbfs.md).
# Files presence
The validator will display a message for all files that are present. A message will be displayed for each missing file. See examples below.

Missing file but not required:

<img width="800" alt="tick boxes" src="https://user-images.githubusercontent.com/63653518/133173202-459fc2e3-6c4b-4748-8a37-94ed362210c0.png">

Missing file and required:

<img width="800" alt="tick boxes" src="https://user-images.githubusercontent.com/63653518/133173256-d57d5b5a-4eb0-4114-89a6-fac60b3864a1.png">

## Required files
system_information.json is required for all GBFS versions.
gbfs.json is required as of v2.0

## Conditionally required files
Three files are conditionally required for all GBFS versions:
station_information.json: required for systems utilizing docks
station_status.json: required for systems utilizing docks
free_bike_status.json: required for free floating vehicles
The validator will check for the presence of those files depending on the options “Free-floating” or Docked” that the user selected on the interface.

<img width="350" alt="tick boxes" src="https://user-images.githubusercontent.com/63653518/133173329-fab3967d-5e4c-459f-bd2f-ec3415b98d44.png">

One additional conditionally required file has been added in GBFS version 2.1:
vehicle_types.json
The validator is currently considering this file as required, because the conditions are more complex and can’t be represented by the schema currently.

# Fields presence and types
## Required fields
Each file has to be structured in a specific output format. The fields `last_updated`, `ttl`, `version`, `data` are required and checked by the validator.
In “data”, there is a nested JSON containing all the fields mentioned in the specification. All the fields that are described as “required” will be checked by the validator.

Some of the fields are “required” but under an “optional” field. For example, the fields `per_km_pricing` in the file `system_pricing_plans` is optional but if it is defined, the child fields `start`, `rate`, and `interval` has to be defined.

Those are described differently in the JSON Schemas (using dependencies) and those are not currently checked by the validator.
## Conditionally Required fields
The fields described as “conditionally required” are not currently checked by the validator.
## Field types
Each field has a specific field type, as described in the specification.
The validators will flag the following field type if they are invalid, as they are present in the JSON Schema:
- array
- boolean
- date: defined in regex using the formula ```^[0-9]{4}-[0-9]{2}-[0-9]{2}$```
- email
- enum
- float
- language: defined in regex with the formula ```^[a-z]{2,3}(-[A-Z]{2})?$```
- latitude: defined as number with a minimum of -90 and maximum of 90
- longitude: defined as number with a minimum of -180 and maximum of 180
- non-negative Float: defined as number
- non-negative Integer: defined as number
- object
- string
- time: defined in regex with the formula ```^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$```
- timestamp: Defined as integer, with minimum set to Tuesday, December 15, 2015 5:00:00 AM (when GBFS was created)
- url

See examples for wrong field types below

Wrong enum value:
![missing enum](https://user-images.githubusercontent.com/63653518/133173526-7d031fd3-30fb-412c-be9a-4a1dc4d6ae23.png)

Wronf field type:
![wonr type](https://user-images.githubusercontent.com/63653518/133173621-0043bc10-cf21-4502-8c09-b4fc5fd3e9c6.png)






