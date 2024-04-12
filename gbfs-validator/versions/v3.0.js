module.exports = {
  gbfsRequired: true,
  files: options => {
    return [
      { file: 'manifest', required: false },
      { file: 'gbfs_versions', required: false },
      { file: 'system_information', required: true },
      { file: 'vehicle_types', required: false },
      { file: 'station_information', required: options.docked },
      { file: 'station_status', required: options.docked },
      { file: 'vehicle_status', required: options.freefloating },
      { file: 'system_regions', required: false },
      { file: 'system_pricing_plans', required: false },
      { file: 'system_alerts', required: false },
      { file: 'geofencing_zones', required: false }
    ]
  }
}
