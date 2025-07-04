module.exports = ({ pricingPlans }) => {
  const partial = {
    $id: 'pricing_plan_id.json#',
    $merge: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/vehicle_types.json'
      },
      with: {
        properties: {
          data: {
            properties: {
              vehicle_types: {
                items: {
                  properties: {
                    default_pricing_plan_id: {
                      enum: pricingPlans.map((p) => p.plan_id)
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

  return partial
}
