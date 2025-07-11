module.exports = ({ vehicleTypes }) => {
  const partial = {
    $id: 'required_vehicle_type_id.json#'
  }

  const motorVehicleTypes = vehicleTypes.filter((vt) =>
    ['electric_assist', 'electric', 'combustion'].includes(vt.propulsion_type)
  )

  if (motorVehicleTypes.length) {
    partial.$merge = {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/vehicle_status.json'
      },
      with: {
        properties: {
          data: {
            properties: {
              vehicles: {
                items: {
                  errorMessage: {
                    required: {
                      vehicle_type_id:
                        "'vehicle_type_id' is required for this vehicle type"
                    }
                  },
                  if: {
                    properties: {
                      vehicle_type_id: {
                        enum: motorVehicleTypes.map((vt) => vt.vehicle_type_id)
                      }
                    },
                    // "required" so it only trigger "then" when "vehicle_type_id" is present.
                    required: ['vehicle_type_id']
                  },
                  then: {
                    required: ['current_range_meters']
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  partial.$patch = {
    source: {
      $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/vehicle_status.json'
    },
    with: [
      {
        op: 'add',
        path: '/properties/data/properties/vehicles/items/required/0',
        value: 'vehicle_type_id'
      }
    ]
  }

  return partial
}
