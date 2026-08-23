module.exports = ({ vehicleTypes }) => {
  const partial = {
    $id: 'required_vehicle_type_id.json#'
  }

  const motorVehicleTypes = vehicleTypes.filter(vt =>
    ['electric_assist', 'electric', 'combustion'].includes(vt.propulsion_type)
  )

  const vehicleItems = {
    properties: {
      vehicle_type_id: {
        enum: vehicleTypes.map(vt => vt.vehicle_type_id)
      }
    }
  }

  if (motorVehicleTypes.length) {
    vehicleItems.errorMessage = {
      required: {
        vehicle_type_id:
          "'vehicle_type_id' is required for this vehicle type"
      }
    }

    vehicleItems.if = {
      properties: {
        vehicle_type_id: {
          enum: motorVehicleTypes.map(vt => vt.vehicle_type_id)
        }
      },
      // "required" so it only trigger "then" when "vehicle_type_id" is present.
      required: ['vehicle_type_id']
    }

    vehicleItems.then = {
      required: ['current_range_meters']
    }
  }

  partial.$merge = {
    source: {
      $ref:
        'https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#free_bike_statusjson'
    },
    with: {
      properties: {
        data: {
          properties: {
            bikes: {
              items: vehicleItems
            }
          }
        }
      }
    }
  }

  partial.$patch = {
    source: {
      $ref:
        'https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#free_bike_statusjson'
    },
    with: [
      {
        op: 'add',
        path: '/properties/data/properties/bikes/items/required/0',
        value: 'vehicle_type_id'
      }
    ]
  }

  return partial
}
