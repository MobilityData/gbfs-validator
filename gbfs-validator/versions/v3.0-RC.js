const o = require('../nonSchemaValidation')

module.exports = {
  gbfsRequired: true,
  files: (options) => {
    return [
      {
        file: 'gbfs_versions',
        required: false,
        nonSchemaRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'system_information',
        required: true,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'vehicle_types',
        required: false,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkVehicleTypePricing,
          o.checkVehicleTypeConsistency
        ]
      },
      {
        file: 'station_information',
        required: options.docked,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkStationInformationIDs
        ]
      },
      {
        file: 'station_status',
        required: options.docked,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkStationStatusIDs,
          o.checkStationStatusCounts
        ]
      },
      {
        file: 'vehicle_status',
        required: options.freefloating,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkVehicleStatusIDs
        ]
      },
      {
        file: 'system_regions',
        required: false,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL
        ]
      },
      {
        file: 'system_pricing_plans',
        required: false,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'system_alerts',
        required: false,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings
        ]
      },
      {
        file: 'geofencing_zones',
        required: false,
        nonSchemaRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkTranslatedStrings,
          o.checkGeofencingZones
        ]
      }
    ]
  }
}
