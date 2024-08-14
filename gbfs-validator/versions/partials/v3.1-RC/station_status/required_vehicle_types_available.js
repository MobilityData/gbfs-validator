module.exports = ({ vehicleTypes }) => {
  return {
    $id: 'required_vehicle_types_available.json#',
    $merge: {
      source: {
        $ref:
          'https://github.com/MobilityData/gbfs/blob/v3.1-RC/gbfs.md#station_statusjson'
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
                            enum: vehicleTypes.map(vt => vt.vehicle_type_id)
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
        $ref:
          'https://github.com/MobilityData/gbfs/blob/v3.1-RC/gbfs.md#station_statusjson'
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
