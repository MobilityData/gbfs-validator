const { checkAdditionalProperties } = require('./additional_properties')
const { checkVehicleTypePricing } = require('./vehicle_type_pricing')
const { checkTranslatedStrings } = require('./translations')
const { checkTTL } = require('./ttl')
const {
  checkStationInformationIDs,
  checkStationStatusIDs,
  checkStationStatusCounts
} = require('./check_stations')
const {
  checkFreeBikeStatusIDs,
  checkVehicleStatusIDs
} = require('./check_vehicles')
const { checkVehicleTypeConsistency } = require('./check_vehicle_types')
const { checkVehicleTypePricingPlanCosts } = require('./check_pricing_plans')
const { checkGeofencingZones } = require('./check_geofencing_zones')

module.exports = {
  checkAdditionalProperties,
  checkVehicleTypePricing,
  checkTTL,
  checkTranslatedStrings,
  checkVehicleTypeConsistency,
  checkStationInformationIDs,
  checkStationStatusIDs,
  checkStationStatusCounts,
  checkFreeBikeStatusIDs,
  checkVehicleStatusIDs,
  checkVehicleTypePricingPlanCosts,
  checkGeofencingZones
}
