const rules = require('../nonSchemaValidation')

module.exports = {
  gbfsRequired: true,
  files: (options) => {
    return [
      {
        file: 'gbfs_versions',
        required: false,
        nonSchemaRules: [rules.checkAdditionalProperties, rules.checkTTL]
      },
      {
        file: 'system_information',
        required: true,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings
        ]
      },
      {
        file: 'vehicle_types',
        required: false,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings,
          rules.checkVehicleTypePricing,
          rules.checkVehicleTypeConsistency
        ]
      },
      {
        file: 'station_information',
        required: options.docked,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings,
          rules.checkStationInformationIDs
        ]
      },
      {
        file: 'station_status',
        required: options.docked,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkStationStatusIDs,
          rules.checkStationStatusCounts
        ]
      },
      {
        file: 'vehicle_status',
        required: options.freefloating,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkVehicleStatusIDs
        ]
      },
      {
        file: 'system_regions',
        required: false,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL
        ]
      },
      {
        file: 'system_pricing_plans',
        required: false,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings
        ]
      },
      {
        file: 'system_alerts',
        required: false,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings
        ]
      },
      {
        file: 'geofencing_zones',
        required: false,
        nonSchemaRules: [
          rules.checkAdditionalProperties,
          rules.checkTTL,
          rules.checkTranslatedStrings,
          rules.checkGeofencingZones
        ]
      }
    ]
  }
}
