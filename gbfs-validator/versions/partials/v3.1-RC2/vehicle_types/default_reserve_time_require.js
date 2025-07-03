module.exports = ({ pricingPlansIdsWithReservationPrice }) => {
  const partial = {
    $id: 'pricing_plan_id.json#',
    $merge: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs/blob/v3.1-RC2/gbfs.md#vehicle_types.json'
      },
      with: {
        properties: {
          data: {
            properties: {
              vehicle_types: {
                items: {
                  // allOf avoids overwriting the existing if statement about max_range
                  allOf: [
                    {
                      if: {
                        anyOf: [
                          {
                            properties: {
                              default_pricing_plan_id: {
                                enum: pricingPlansIdsWithReservationPrice
                              }
                            }
                          },
                          {
                            properties: {
                              pricing_plan_ids: {
                                contains: {
                                  enum: pricingPlansIdsWithReservationPrice
                                }
                              }
                            }
                          }
                        ]
                      },
                      then: {
                        required: ['default_reserve_time']
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  }

  return partial
}
