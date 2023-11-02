function checkGeofencingZones({ errors, data }) {
  data.data?.geofencing_zones?.features?.forEach((feature) => {
    const multipolygon = feature.geometry

    for (const coordinates of multipolygon.coordinates) {
      for (const geo of coordinates) {
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
