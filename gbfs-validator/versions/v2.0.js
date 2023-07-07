const o = require('../otherValidation')

module.exports = {
  gbfsRequired: true,
  files: (options) => {
    return [
      {
        file: 'gbfs_versions',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'system_information',
        required: true,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'station_information',
        required: options.docked,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkStationInformationIDs
        ]
      },
      {
        file: 'station_status',
        required: options.docked,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkStationStatusIDs,
          o.checkStationStatusCounts
        ]
      },
      {
        file: 'free_bike_status',
        required: options.freefloating,
        otherRules: [
          o.checkAdditionalProperties,
          o.checkTTL,
          o.checkFreeBikeStatusIDs
        ]
      },
      {
        file: 'system_hours',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'system_calendar',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
      },
      {
        file: 'system_regions',
        required: false,
        otherRules: [o.checkAdditionalProperties, o.checkTTL]
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
      }
    ]
  }
}
