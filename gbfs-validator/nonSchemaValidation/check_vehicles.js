const { getFileBody } = require('./utils')

function getVehicleTypes(allFiles, lang) {
  const body = getFileBody(allFiles, 'vehicle_types', lang)

  return body?.data?.vehicle_types
}

function checkFreeBikeStatusIDs({ errors, data, lang, allFiles }) {
  let ids = new Set()

  let vehicle_types_ids = new Set()
  let vehicle_types = getVehicleTypes(allFiles, lang) || []
  vehicle_types.map((vehicle_type) => {
    vehicle_types_ids.add(vehicle_type.vehicle_type_id)
  })

  data.data.bikes.map((bike) => {
    if (ids.has(bike.bike_id)) {
      errors.push({
        path: '/data/bikes/bike_id',
        key: 'duplicate_bike_id',
        message: `Duplicate bike_id`,
        bike_id: bike.bike_id
      })
      return
    }

    if (bike.vehicle_type_id && !vehicle_types_ids.has(bike.vehicle_type_id)) {
      errors.push({
        path: '/data/bikes/vehicle_type_id',
        key: 'invalid_vehicle_type_id',
        message: `Invalid vehicle_type_id`,
        bike_id: bike.bike_id
      })
      return
    }

    ids.add(bike.bike_id)
  })
}

function checkVehicleStatusIDs({ errors, data, lang, allFiles }) {
  let ids = new Set()

  let vehicle_types_ids = new Set()
  let vehicle_types = getVehicleTypes(allFiles, lang) || []
  vehicle_types.map((vehicle_type) => {
    vehicle_types_ids.add(vehicle_type.vehicle_type_id)
  })

  data.data.vehicles.map((vehicle) => {
    if (ids.has(vehicle.vehicle_id)) {
      errors.push({
        path: '/data/vehicles/vehicle_id',
        key: 'duplicate_vehicle_id',
        message: `Duplicate vehicle_id`,
        vehicle_id: vehicle.vehicle_id
      })
      return
    }

    ids.add(vehicle.vehicle_id)

    if (
      vehicle.vehicle_type_id &&
      !vehicle_types_ids.has(vehicle.vehicle_type_id)
    ) {
      errors.push({
        path: '/data/vehicles/vehicle_type_id',
        key: 'invalid_vehicle_type_id',
        message: `Invalid vehicle_type_id`,
        vehicle_id: vehicle.vehicle_id
      })
    }
  })
}

module.exports = {
  checkFreeBikeStatusIDs,
  checkVehicleStatusIDs
}
