const { getFileBody } = require('./utils')

function checkStationInformationIDs({ errors, data, lang, allFiles }) {
  const stationsStatus = getFileBody(allFiles, 'station_status', lang)

  if (!stationsStatus) {
    return
  }

  const ids = new Set()

  data.data.stations.forEach((station) => {
    if (!station.station_id) {
      return
    }

    if (ids.has(station.station_id)) {
      errors.push({
        path: '/data/stations/station_id',
        key: 'duplicate_station_id',
        message: `Duplicate station_id`,
        station_id: station.station_id
      })
      return
    }

    ids.add(station.station_id)

    let status = stationsStatus.data?.stations?.find(
      (s) => s.station_id === station.station_id
    )
    if (!status) {
      errors.push({
        path: '/data/stations/station_id',
        key: 'missing_station_status',
        message: `Missing station_status`,
        station_id: station.station_id
      })
    }
  })
}

function checkStationStatusIDs({ errors, data, lang, allFiles }) {
  const stationsInformation = getFileBody(allFiles, 'station_information', lang)

  if (!stationsInformation) {
    return
  }

  const ids = new Set()

  data.data.stations.forEach((station) => {
    if (!station.station_id) {
      return
    }

    if (ids.has(station.station_id)) {
      errors.push({
        path: '/data/stations/station_id',
        key: 'duplicate_station_id',
        message: `Duplicate station_id`,
        station_id: station.station_id
      })
      return
    }

    ids.add(station.station_id)

    let information = stationsInformation.data?.stations?.find(
      (s) => s.station_id === station.station_id
    )
    if (!information) {
      errors.push({
        path: '/data/stations/station_id',
        key: 'missing_station_information',
        message: `Missing station_information`,
        station_id: station.station_id
      })
    }
  })
}

function checkStationStatusCounts({
  errors,
  warnings,
  data,
  version,
  lang,
  allFiles
}) {
  const stationsInformation = getFileBody(allFiles, 'station_information', lang)

  data.data.stations.forEach((station) => {
    if (station.vehicle_types_available) {
      let num_vehicles_available =
        version === '3.0-RC'
          ? station.num_vehicles_available
          : station.num_bikes_available

      let count = 0
      station.vehicle_types_available.forEach((vehicle) => {
        count += vehicle.count
      })

      if (count !== num_vehicles_available) {
        warnings.push({
          path: '/data/station/num_vehicles_available',
          key: 'num_vehicles_available_incorrect',
          message: `num_vehicles_available is not equal to the sum of vehicle_types_available.count`,
          station_id: station.station_id
        })
      }
    }

    if (station.vehicle_docks_available) {
      let num_docks_available = 0
      station.vehicle_docks_available.forEach((vehicle) => {
        num_docks_available += vehicle.count
      })

      if (num_docks_available !== station.num_docks_available) {
        warnings.push({
          path: '/data/station/num_docks_available',
          key: 'num_docks_available_incorrect',
          message: `num_docks_available is not equal to the sum of vehicle_docks_available.count`,
          station_id: station.station_id
        })
      }
    }
  })
}

module.exports = {
  checkStationInformationIDs,
  checkStationStatusIDs,
  checkStationStatusCounts
}
