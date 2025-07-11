module.exports = ({ vehicleTypes }) => {
  return {
    $id: 'required_vehicle_types_available.json#',
    $merge: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/station_status.json'
      },
      with: {
        properties: {
          data: {
            properties: {
              stations: {
                items: {
                  properties: {
                    vehicle_types_available: {
                      items: {
                        properties: {
                          vehicle_type_id: {
                            enum: vehicleTypes.map((vt) => vt.vehicle_type_id)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    $patch: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/station_status.json'
      },
      with: [
        {
          op: 'add',
          path: '/properties/data/properties/stations/items/required/0',
          value: 'vehicle_types_available'
        }
      ]
    }
  }
}
