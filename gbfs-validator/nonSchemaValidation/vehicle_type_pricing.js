const { getFileBody } = require('./utils')

function checkVehicleTypePricing({ errors, data, version, lang, allFiles }) {
  const systemPricingPlans = getFileBody(allFiles, 'system_pricing_plans', lang)


  const plans = systemPricingPlans?.data?.plans

  for (const [index, vehicle_type] of data.data.vehicle_types.entries()) {
    if (!plans) {
      if (
        vehicle_type.default_pricing_plan_id ||
        vehicle_type.pricing_plan_ids?.length
      ) {
        errors.push({
          path: '/data/vehicle_types/' + index,
          key: 'missing_system_pricing_plans',
          message: `Missing system_pricing_plans.`
        })
      }
      return
    }

    if (version === '3.0-RC') {
      if (!vehicle_type.default_pricing_plan_id) {
        errors.push({
          path: '/data/vehicle_types/' + index,
          key: 'missing_default_pricing_plan_id',
          message: `Missing default_pricing_plan_id.`
        })

        return
      }
    }

    let plan_ids = []
    if (vehicle_type.pricing_plan_ids) {
      plan_ids = vehicle_type.pricing_plan_ids
    } else if (vehicle_type.default_pricing_plan_id) {
      plan_ids = [vehicle_type.default_pricing_plan_id]
    }

    for (const plan_id of plan_ids) {
      let plan = plans.find((p) => p.plan_id === plan_id)

      if (!plan) {
        errors.push({
          path: '/data/vehicle_types/' + index,
          key: 'missing_system_pricing_plans',
          message: `plan_id not found in system_pricing_plans.`,
          plan_id
        })
        continue
      }

      if (vehicle_type.default_reserve_time === undefined) {
        if (
          plan.reservation_price_per_min ||
          plan.reservation_price_flat_rate
        ) {
          errors.push({
            path: '/data/vehicle_types/' + index,
            key: 'default_reserve_time',
            message: `Missing default_reserve_time.`
          })
        }
      }
    }
  }
}

module.exports = { checkVehicleTypePricing }
