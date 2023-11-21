module.exports = ({ pricingPlans }) => {
  return {
    $id: 'pricing_plan_id.json#',
    $merge: {
      source: {
        $ref:
          'https://github.com/MobilityData/gbfs/blob/v2.3/gbfs.md#vehicle_typesjson'
      },
      with: {
        properties: {
          data: {
            properties: {
              vehicle_types: {
                items: {
                  properties: {
                    default_pricing_plan_id: {
                      enum: pricingPlans.map(p => p.plan_id)
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
