module.exports = ({ pricingPlans }) => {
  return {
    $id: 'pricing_plan_id.json#',
    $merge: {
      source: {
        $ref:
          'https://github.com/NABSA/gbfs/blob/v3.0-RC2/gbfs.md#vehicle_typesjson-added-in-v21-rc'
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
