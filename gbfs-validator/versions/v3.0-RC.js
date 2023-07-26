const o = require('../nonSchemaValidation')

module.exports = {
  gbfsRequired: true,
  files: (options) => {
    return [
      {
        file: 'gbfs_versions',
        required: false,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'system_information',
        required: true,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'vehicle_types',
        required: false,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkVehicleTypePricing,
          o.checkVehicleTypeConsistency,
          o.checkVehicleTypePricingPlanCosts
        ]
      },
      {
        file: 'station_information',
        required: options.docked,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkStationInformationIDs
        ]
      },
      {
        file: 'station_status',
        required: options.docked,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkStationStatusIDs,
          o.checkStationStatusCounts
        ]
      },
      {
        file: 'vehicle_status',
        required: options.freefloating,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkVehicleStatusIDs
        ]
      },
      {
        file: 'system_regions',
        required: false,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'system_pricing_plans',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'system_alerts',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'geofencing_zones',
        required: false,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkGeofencingZones
        ]
      }
    ]
  }
}
