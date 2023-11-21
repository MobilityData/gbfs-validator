This project validates feeds up to version 3.0-RC2 of the [JSON Schemas](https://github.com/MobilityData/gbfs-json-schema).
# Files presence
The validator will flag any missing file. It will inform the user if the missing file is required or not, as per the conditions in the GBFS version that it detects.

<img width="600" alt="Screen Shot 2022-03-01 at 10 10 07 AM" src="https://user-images.githubusercontent.com/63653518/156194659-afcc64ef-1e57-4d60-b8c1-2daebf1ef2bd.png">

## Required files
`system_information.json` is **required** for all GBFS versions.
`gbfs.json` is required as of v2.0

## Conditionally required files
Three files are **conditionally required** for all GBFS versions:
- `station_information.json`: required for systems utilizing docks
- `station_status.json`: required for systems utilizing docks
- `free_bike_status.json`: required for free floating vehicles
The validator will check for the presence of the files depending on the options “Free-floating” or Docked” that the user selected on the interface.

<img width="350" alt="tick boxes" src="https://user-images.githubusercontent.com/63653518/156194900-bab75f85-f681-43a4-84d3-08c9d6fed4df.png">


The Validator also checks the conditional requirement of the file `vehicle_types.json`: as per the [official GBFS specification](https://github.com/MobilityData/gbfs/blob/master/gbfs.md#vehicle_typesjson), it is required of systems that include information about vehicle types in the `vehicle_status.json file`.


# Fields presence and field types
## Required fields
Each file in GBFS has to be structured in a specific [output format](https://github.com/MobilityData/gbfs/blob/master/gbfs.md#output-format).
All the fields that are described as **required** in GBFS will be checked by the validator.
Some fields are required only if the parent field is defined, and this is considered a **conditionally required** field.

## Conditionally Required fields
The simple **conditionally required** fields (where the condition depends on another field in the same file) are represented by the JSON Schemas and will be checked by this validator.\
The more complex **conditionally required fields** are covered by custom rules that have been added in this validator (in [PR#63](https://github.com/MobilityData/gbfs-validator/pull/63)).\

The following conditions are all covered by this validator:
- **system_information.json**

`brand_assets.brand_last_modified`\
`brand_assets.brand_image_url`\
`terms_last_updated`\
`privacy_last_updated`\
`rental_apps.android.store_uri`\
`rental_apps.android.discovery_uri`\
`rental_apps.ios.store_uri`\
`rental_apps.ios.discovery_uri`

- **vehicle_types.json**

`vehicle_types.max_range_meters`\
`vehicle_types.vehicle_assets.icon_url`\
`vehicle_types.vehicle_assets.icon_last_modified`\
`default_pricing_plan_id`

- **station_status.json**

`stations.vehicle_types_available.vehicle_type_id`\
`stations.vehicle_types_available.count`\
`stations.vehicle_docks_available.vehicle_type_ids`\
`stations.vehicle_docks_available.count`\
`vehicle_types_available`

- **geofencing_zones.json**

`geofencing_zones.features.properties.rules.ride_allowed`\
`geofencing_zones.features.properties.rules.ride_through_allowed`

- **free_bike_status.json**
`vehicle_type_id`
`current_range_meters`

- **conditions that are not covered by this validator**
`num_docks_available` in station_status.json`: because it depends on something that isn't defined in the GBFS files: the docking capacity. See the official GBFS spec about this field [here](https://github.com/MobilityData/gbfs/blob/master/gbfs.md#station_statusjson).\
`vehicle_docks_available` in station_status.json`: because it depends on something that isn't defined in the GBFS files: *REQUIRED in feeds where [...] certain docks are only able to accept certain vehicle types.* See the official GBFS spec about this field [here](https://github.com/MobilityData/gbfs/blob/master/gbfs.md#station_statusjson).\
`system_id` in `free_bike_status.json`

## Field types
Each field has a specific field type, as described in the specification.
The validators will flag the following field type if they are invalid.
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

See examples for wrong field types below:


<img width="800" alt="enum" src="https://user-images.githubusercontent.com/63653518/156201396-af4e7372-732a-43e4-b7da-0d6efa37df53.png">
<img width="800" alt="type" src="https://user-images.githubusercontent.com/63653518/156201428-27ffa407-a951-4f1d-bc2c-d82eecc2fe2d.png">

