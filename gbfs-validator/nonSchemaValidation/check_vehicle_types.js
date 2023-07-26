function checkVehicleTypeConsistency({ errors, warnings, data }) {
  let vehicle_types_ids = new Set()

  data.data.vehicle_types.map((vehicle_type) => {
    let max_rider_capacity = 2
    let max_cargo_volume_capacity = 100
    let max_cargo_load_capacity = 100
    let propulsion_types
    let max_range_meters
    let min_range_meters
    let vehicle_accessories
    let min_wheel_count = 2
    let max_wheel_count = 4

    switch (vehicle_type.form_factor) {
      case 'bicycle':
        max_rider_capacity = 2
        max_cargo_volume_capacity = 50
        max_cargo_load_capacity = 50
        propulsion_types = ['human', 'electric_assist']
        if (vehicle_type.max_range_meters) {
          min_range_meters = 5_000
          max_range_meters = 100_000
        }
        vehicle_accessories = ['navigation']
        min_wheel_count = 2
        break
      case 'cargo_bicycle':
        max_rider_capacity = 2
        max_cargo_volume_capacity = 1000
        max_cargo_load_capacity = 500
        propulsion_types = ['human', 'electric_assist']
        if (vehicle_type.max_range_meters) {
          min_range_meters = 5_000
          max_range_meters = 100_000
        }
        vehicle_accessories = ['navigation']
        break
      case 'car':
        max_rider_capacity = 5
        max_cargo_volume_capacity = 1000
        max_cargo_load_capacity = 1000
        propulsion_types = [
          'electric',
          'combustion',
          'combustion_diesel',
          'hybrid',
          'plug_in_hybrid',
          'hydrogen_fuel_cell'
        ]
        min_range_meters = 50_000
        max_range_meters = 1000_000
        min_wheel_count = 4
        break
      case 'moped':
        max_rider_capacity = 2
        max_cargo_volume_capacity = 50
        max_cargo_load_capacity = 50
        propulsion_types = ['electric', 'combustion']
        min_range_meters = 5_000
        max_range_meters = 100_000
        vehicle_accessories = ['navigation']
        max_wheel_count = 3
        break
      case 'scooter_standing':
      case 'scooter_seated':
        max_rider_capacity = 1
        max_cargo_volume_capacity = 50
        max_cargo_load_capacity = 50
        propulsion_types = ['electric']
        min_range_meters = 5_000
        max_range_meters = 100_000
        vehicle_accessories = ['navigation']
        max_wheel_count = 3
        break
    }

    if (vehicle_type.rider_capacity > max_rider_capacity) {
      warnings.push({
        path: '/vehicle_types/rider_capacity',
        key: 'unexpected_rider_capacity',
        message: `Unexpected rider_capacity for ${vehicle_type.form_factor}: ${vehicle_type.rider_capacity}`
      })
    }

    if (vehicle_type.cargo_volume_capacity > max_cargo_volume_capacity) {
      warnings.push({
        path: '/vehicle_types/cargo_volume_capacity',
        key: 'unexpected_cargo_volume_capacity',
        message: `Unexpected cargo_volume_capacity for ${vehicle_type.form_factor}: ${vehicle_type.cargo_volume_capacity}`
      })
    }

    if (vehicle_type.cargo_load_capacity > max_cargo_load_capacity) {
      warnings.push({
        path: '/vehicle_types/cargo_load_capacity',
        key: 'unexpected_cargo_load_capacity',
        message: `Unexpected cargo_load_capacity for ${vehicle_type.form_factor}: ${vehicle_type.cargo_load_capacity}`
      })
    }

    if (
      propulsion_types &&
      !propulsion_types.includes(vehicle_type.propulsion_type)
    ) {
      warnings.push({
        path: '/vehicle_types/propulsion_type',
        key: 'unexpected_propulsion_type',
        message: `Unexpected propulsion_type for ${vehicle_type.form_factor}: ${vehicle_type.propulsion_type}`
      })
    }

    if (min_range_meters && vehicle_type.max_range_meters < min_range_meters) {
      warnings.push({
        path: '/vehicle_types/max_range_meters',
        key: 'unexpectedly_low_range_meters',
        message: `Unexpected max_range_meters for ${vehicle_type.form_factor}: ${vehicle_type.max_range_meters}`
      })
    }

    if (max_range_meters && vehicle_type.max_range_meters > max_range_meters) {
      warnings.push({
        path: '/vehicle_types/max_range_meters',
        key: 'unexpectedly_high_range_meters',
        message: `Unexpected max_range_meters for ${vehicle_type.form_factor}: ${vehicle_type.max_range_meters}`
      })
    }

    if (vehicle_accessories && vehicle_type.vehicle_accessories) {
      vehicle_type.vehicle_accessories.map((vehicle_accessory) => {
        if (!vehicle_accessories.includes(vehicle_accessory)) {
          warnings.push({
            path: '/vehicle_types/vehicle_accessories',
            key: 'unexpected_vehicle_accessory',
            message: `Unexpected vehicle_accessory for ${vehicle_type.form_factor}: ${vehicle_accessory}`
          })
        }
      })

      let has_door_count = false
      let accessories = new Set()

      vehicle_type.vehicle_accessories.map((vehicle_accessory) => {
        if (accessories.has(vehicle_accessory)) {
          errors.push({
            path: '/vehicle_types/vehicle_accessories',
            key: 'duplicate_vehicle_accessory',
            message: `Duplicate vehicle_accessory for ${vehicle_type.form_factor}: ${vehicle_accessory}`
          })
        }

        if (vehicle_accessory.match(/doors_\d+$/g)) {
          if (has_door_count) {
            errors.push({
              path: '/vehicle_types/vehicle_accessories',
              key: 'incorrect_vehicle_accessory',
              message: `Incorrect vehicle_accessory for ${vehicle_type.form_factor}: ${vehicle_accessory}`
            })
          }

          has_door_count = true
        }

        accessories.add(vehicle_accessory)
      })
    }

    if (
      vehicle_type.wheel_count &&
      vehicle_type.wheel_count < min_wheel_count
    ) {
      warnings.push({
        path: '/vehicle_types/wheel_count',
        key: 'unexpectedly_low_wheel_count',
        message: `Unexpected wheel_count for ${vehicle_type.form_factor}: ${vehicle_type.wheel_count}`
      })
    }

    if (
      vehicle_type.wheel_count &&
      vehicle_type.wheel_count > max_wheel_count
    ) {
      warnings.push({
        path: '/vehicle_types/wheel_count',
        key: 'unexpectedly_high_wheel_count',
        message: `Unexpected wheel_count for ${vehicle_type.form_factor}: ${vehicle_type.wheel_count}`
      })
    }

    vehicle_types_ids.add(vehicle_type.vehicle_type_id)
  })
  ;[...vehicle_types_ids].forEach((vehicle_type_id) => {
    if (
      data.data.vehicle_types.filter(
        (vehicle_type) => vehicle_type.vehicle_type_id === vehicle_type_id
      ).length > 1
    ) {
      errors.push({
        path: '/vehicle_types/vehicle_type_id',
        key: 'duplicate_vehicle_type_id',
        message: `Duplicate vehicle_type_id`,
        vehicle_type_id: vehicle_type_id
      })
    }
  })
}

module.exports = {
  checkVehicleTypeConsistency
}
