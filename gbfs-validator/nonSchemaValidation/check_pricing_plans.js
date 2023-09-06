const { getFileBody } = require('./utils')

const TYPICAL_PRICING_PER_TYPE = {
  bicycle: { km: 5, minutes: 20, minCost: 1, maxCost: 15 },
  cargo_bicycle: { km: 5, minutes: 20, minCost: 1, maxCost: 15 },
  scooter_standing: { km: 5, minutes: 20, minCost: 1, maxCost: 15 },
  scooter_seated: { km: 5, minutes: 20, minCost: 1, maxCost: 15 },
  scooter: { km: 5, minutes: 20, minCost: 1, maxCost: 15 },
  car: { km: 30, minutes: 60, minCost: 5, maxCost: 50 },
  moped: { km: 30, minutes: 60, minCost: 2, maxCost: 30 }
}

function computeInterval(value, { start, end, interval }) {
  if (value <= start) {
    // The trip distance or duration is inferior to the kilometer or minute 
    // at which this segment rate starts being charged (inclusive). 
    return 0
  }

  if (!interval) {
    // An interval of 0 indicates the rate is only charged once.
    return 1
  }

  // The value at which the rate will no longer apply (exclusive) for example,
  // if end is 20 the rate no longer applies at 20.00.
  // If this field is empty, the price issued for this segment is charged until the trip ends,
  // in addition to the cost of any subsequent segments.
  end = end ? Math.min(value, end) : value

  // Rate that is charged at each interval after the start.
  // Can be a negative number, which indicates that the traveler will receive a discount.
  return Math.ceil((end - start) / interval)
}

function computeCost({ plan, km, min }) {
  let cost = 0

  if (typeof plan.price === 'string') {
    cost = parseFloat(plan.price) || 0
  } else if (typeof plan.price === 'number') {
    cost = plan.price
  }

  // Array of segments when the price is a function of distance traveled, displayed in kilometers.
  plan.per_km_pricing?.map((per_km) => {
    cost += per_km.rate * computeInterval(km, per_km)
  })

  // Array of segments when the price is a function of time traveled, displayed in minutes.
  plan.per_min_pricing?.map((per_min) => {
    cost += per_min.rate * computeInterval(min, per_min)
  })

  return Math.round(cost * 100) / 100
}

function checkVehicleTypePricingPlanCosts({
  errors,
  warnings,
  data,
  lang,
  allFiles
}) {
  const pricing_plans = getFileBody(allFiles, 'system_pricing_plans', lang)

  const plans = pricing_plans?.data?.plans
  if (!plans) {
    return
  }

  data.data?.vehicle_types?.map((vehicle_type) => {
    let plan_ids
    if (vehicle_type.pricing_plan_ids) {
      plan_ids = vehicle_type.pricing_plan_ids
    } else if (vehicle_type.default_pricing_plan_id) {
      plan_ids = [vehicle_type.default_pricing_plan_id]
    } else {
      return
    }

    plan_ids.map((plan_id) => {
      const plan = plans.find((plan) => plan.plan_id === plan_id)

      if (!plan) {
        errors.push({
          path: '/data/vehicle_types/pricing_plan_ids',
          key: 'invalid_pricing_plan_id',
          message: `Invalid pricing_plan_id`,
          plan_id
        })
        return
      }

      if (plan.currency !== 'EUR' && plan.currency !== 'USD') {
        return
      }

      const typical_pricing = TYPICAL_PRICING_PER_TYPE[vehicle_type.form_factor]

      if (!typical_pricing) {
        return
      }

      const cost = computeCost({
        plan,
        km: typical_pricing.km,
        min: typical_pricing.minutes
      })

      if (cost > typical_pricing.maxCost) {
        warnings.push({
          path: '/data/vehicle_types/pricing_plan_ids',
          key: 'high_cost',
          message: `High cost: ${cost} ${plan.currency} for ${typical_pricing.km} km and ${typical_pricing.minutes} min on ${vehicle_type.form_factor} (${vehicle_type.vehicle_type_id})`
        })
      }

      if (cost < typical_pricing.minCost) {
        warnings.push({
          path: '/data/vehicle_types/pricing_plan_ids',
          key: 'low_cost',
          message: `Low cost: ${cost} ${plan.currency} for ${typical_pricing.km} km and ${typical_pricing.minutes} min on ${vehicle_type.form_factor} (${vehicle_type.vehicle_type_id})`
        })
      }
    })
  })
}

module.exports = {
  checkVehicleTypePricingPlanCosts
}
