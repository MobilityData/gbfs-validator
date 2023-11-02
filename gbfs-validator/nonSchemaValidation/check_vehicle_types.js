function checkVehicleTypeConsistency({ errors, warnings, data }) {
  let vehicle_types_ids = new Set()

  data.data.vehicle_types.forEach((vehicle_type) => {
    vehicle_types_ids.add(vehicle_type.vehicle_type_id)
  })
  vehicle_types_ids.forEach((vehicle_type_id) => {
    if (
      data.data.vehicle_types.filter(
        (vehicle_type) => vehicle_type.vehicle_type_id === vehicle_type_id
      ).length > 1
    ) {
      errors.push({
        path: '/data/vehicle_types/vehicle_type_id',
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
