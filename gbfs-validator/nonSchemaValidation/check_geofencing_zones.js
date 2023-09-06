function checkGeofencingZones({ errors, data }) {
  data.data?.geofencing_zones?.features?.map((feature) => {
    const multypolygon = feature.geometry

    for (const multi_coordinates of multypolygon.coordinates) {
      for (const geo of multi_coordinates) {
        const first = geo[0]
        const last = geo[geo.length - 1]

        if (first[0] !== last[0] || first[1] !== last[1]) {
          errors.push({
            path: '/data/geofencing_zones/features/geometry/coordinates',
            key: 'unclosed_polygon',
            message: `The polygon is not closed`
          })
          break
        }
      }
    }
  })
}

module.exports = {
  checkGeofencingZones
}
