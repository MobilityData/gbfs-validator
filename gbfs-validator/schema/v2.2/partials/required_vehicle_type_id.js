module.exports = ({ vehicleTypes }) => ({
  $id: 'required_vehicle_type_id.json#',
  $merge: {
    source: {
      $ref:
        'https://github.com/NABSA/gbfs/blob/master/gbfs.md#free_bike_statusjson'
    },
    with: {
      properties: {
        data: {
          properties: {
            bikes: {
              items: {
                if: {
                  properties: {
                    vehicle_type_id: {
                      enum: vehicleTypes
                        .filter(vt =>
                          [
                            'electric_assist',
                            'electric',
                            'combustion'
                          ].includes(vt.propulsion_type)
                        )
                        .map(vt => vt.vehicle_type_id)
                    }
                  },
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
  },
  $patch: {
    source: {
      $ref:
        'https://github.com/NABSA/gbfs/blob/master/gbfs.md#free_bike_statusjson'
    },
    with: [
      {
        op: 'add',
        path: '/properties/data/properties/bikes/items/required/0',
        value: 'vehicle_type_id'
      }
    ]
  }
})
