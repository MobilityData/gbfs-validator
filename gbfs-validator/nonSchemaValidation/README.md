# last_updated_future

If `last_updated` is in the future, the validator will return an error.

# last_updated_outdated

If `last_updated` is older than 5 minutes for near real-time feeds,
the validator will return a warning.

# additional_properties

*(as of v2.1)* If any file contains additional properties, the validator will return a warning, to help detects typos or fields that could be updated to conform to the GBFS specification.

# missing_translation

*(as of v3.0-RC)* If any `Localized String` is missing a lang declared in the `languages` field of `system_information.json`, the validator will return an error.

# unknown_language

*(as of v3.0-RC)* If any `Localized String` has a lang that is not declared in the `languages` field of `system_information.json`, the validator will return an error.

# missing_system_pricing_plans

*(added in v2.3)* If `default_pricing_plan_id` or `pricing_plan_ids` is specified in `vehicle_types.json`, but no corresponding pricing plan is defined in `system_pricing_plans.json`, the validator will return an error.

# missing_default_pricing_plan_id

*(added in v2.3)* If the `default_pricing_plan_id` is not present in the `vehicle_types.json` file when pricing plans are present, the validator will return an error.

# missing_station_information

If a station is declared in `station_status.json` but not in `station_information.json`, the validator will return an error.

# missing_station_status

If a station is declared in `station_information.json` but not in `station_status.json`, the validator will return an error.

# duplicate_station_id
If `station_information.json` or `station_status.json` contain duplicate `station_id`, the validator will return an error.

# default_reserve_time

*(added in v2.3)* If the `default_reserve_time` is not present in the `vehicle_types.json` file for a vehicle type that use a pricing declaring `reservation_price_per_min` or `reservation_price_flat_rate`, the validator will return an error.

# num_vehicles_available_incorrect

*(added in v2.1)* If `num_vehicles_available` on a station is not equal to the sum of `vehicle_types_available.count` for each vehicle type, the validator will return a warning.

# num_docks_available_incorrect

*(added in v2.1)* If `num_docks_available` on a station is not equal to the sum of `vehicle_docks_available.count` for each vehicle type, the validator will return a warning.

# unclosed_polygon

*(added in v2.1)* If a the last coordinate of the LineString of a polygon is not the same as the first coordinate, the validator will return an error.

# duplicate_bike_id

If the `free_bike_status.json` contains duplicate `bike_id`, the validator will return an error.

# invalid_vehicle_type_id

*(added in v2.1)* If a referenced `vehicle_type_id` is not present in the `vehicle_types.json` file, the validator will return an error.

# duplicate_vehicle_id

*(as of v3.0-RC)* If the `vehicle_status.json` contains duplicate `vehicle_id`, the validator will return an error.

# duplicate_vehicle_type_id

*(added in v2.1)* If the `vehicle_types.json` contains duplicate `vehicle_type_id`, the validator will return an error.
