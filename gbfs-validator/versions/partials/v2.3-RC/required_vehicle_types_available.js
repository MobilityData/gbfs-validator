module.exports = () => {
  return {
    $id: 'required_vehicle_types_available.json#',
    $patch: {
      source: {
        $ref:
          'https://github.com/NABSA/gbfs/blob/v2.3-RC/gbfs.md#station_statusjson'
      },
      with: [
        {
          op: 'add',
          path: '/properties/data/properties/stations/items/required/0',
          value: 'vehicle_types_available'
        }
      ]
    }
  }
}
