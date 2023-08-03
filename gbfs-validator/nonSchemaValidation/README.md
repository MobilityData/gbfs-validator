# last_updated_future

If `last_updated` is in the future, the validator will return an error.

# last_updated_outdated

If `last_updated` is older than 5 minutes for near real-time feeds,
the validator will return an error.

# additional_properties

If any file contains additional properties, the validator will return a warning, to help detects typos or fields that could be updated to conform to the GBFS specification.

# missing_translation

If any `Localized String` is missing a lang declared in the `languages` field of `system_information.json`, the validator will return an error.

# duplicate_translation

If any `Localized String` has more than one translation for the same lang, the validator will return an error.

# unknown_language

If any `Localized String` has a lang that is not declared in the `languages` field of `system_information.json`, the validator will return an error.

# missing_system_pricing_plans

If a pricing is used (like in `default_pricing_plan_id` or `pricing_plan_ids` of the `vehicle_types.json` file ), but not pricing are declared, the validator will return an error.

# missing_default_pricing_plan_id

If the `default_pricing_plan_id` is not present in the `vehicle_types.json` file when pricing plans are present, the validator will return an error.

# missing_station_information

If a station is declared `station_status.json` but not in `station_information.json`, the validator will return an error.

# missing_station_status

If a station is declared `station_information.json` but not in `station_status.json`, the validator will return an error.

# unknown_plan_id

If a pricing plan id is used (like in `default_pricing_plan_id` or `pricing_plan_ids` of the `vehicle_types.json` file ), but is not present in the `system_pricing_plans.json` file, the validator will return an error.

# default_reserve_time

If the `default_reserve_time` is not present in the `vehicle_types.json` file for a vehicle type that use a pricing declaring `reservation_price_per_min` or `reservation_price_flat_rate`, the validator will return an error.

# num_vehicles_available_incorrect

If `num_vehicles_available` on a station is not equal to the sum of `vehicle_types_available.count` for each vehicle type, the validator will return an error.

# num_docks_available_incorrect

If `num_docks_available` on a station is not equal to the sum of `vehicle_docks_available.count` for each vehicle type, the validator will return an error.

# num_docks_available_high

If `num_docks_available` on a station is unusually high validator will return a warning.

# num_vehicles_available_high

If `num_vehicles_available` on a station is unusually high, the validator will return a warning.

# station_capacity_too_low

If `capacity` on a station is lower than the sum of `num_vehicles_available` and `num_docks_available`, the validator will return an error.

# unclosed_polygon

If a the last coordinate of the LineString of a polygon is not the same as the first coordinate, the validator will return an error.

# unexpected_rider_capacity

If the `rider_capacity` value is unexpected regarding the vehicle type, the validator will return a warning.

# unexpected_cargo_volume_capacity

If the `cargo_volume_capacity` value is unexpected regarding the vehicle type, the validator will return a warning.

# unexpected_cargo_load_capacity

If the `cargo_load_capacity` value is unexpected regarding the vehicle type, the validator will return a warning.

# unexpected_propulsion_type

If the `propulsion_type` value is unexpected regarding the vehicle type, the validator will return a warning.

# unexpectedly_low_range_meters

If the `range_meters` value is unexpectedly low regarding the vehicle type, the validator will return a warning.

# unexpectedly_high_range_meters

If the `range_meters` value is unexpectedly high regarding the vehicle type, the validator will return a warning.

# unexpected_vehicle_accessory

If the `vehicle_accessories` value is unexpected regarding the vehicle type, the validator will return a warning.

# unexpectedly_low_wheel_count

If the `wheel_count` value is unexpectedly low regarding the vehicle type, the validator will return a warning.

# unexpectedly_high_wheel_count

If the `wheel_count` value is unexpectedly high regarding the vehicle type, the validator will return a warning.

# duplicate_vehicle_accessory

If the `vehicle_accessories` value contains duplicates, the validator will return an error.

# duplicate_bike_id

If the `free_bike_status.json` contains duplicate `bike_id`, the validator will return an error.

# invalid_vehicle_type_id

If a referenced `vehicle_type_id` is not present in the `vehicle_types.json` file, the validator will return an error.

# duplicate_vehicle_id

If the `vehicle_status.json` contains duplicate `vehicle_id`, the validator will return an error.

# invalid_pricing_plan_id

If a referenced `pricing_plan_id` is not present in the `system_pricing_plans.json` file, the validator will return an error.

# low_cost

If the computed cost seams low regarding the `form_factor` and `propulsion_type`, the validator will return a warning.

# high_cost

If the computed cost seams high regarding the `form_factor` and `propulsion_type`, the validator will return a warning.

# duplicate_vehicle_type_id

If the `vehicle_types.json` contains duplicate `vehicle_type_id`, the validator will return an error.
