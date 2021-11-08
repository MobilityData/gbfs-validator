module.exports = () => ({
  $id: 'no_required_vehicle_type_id.json#',
  $patch: {
    source: {
      $ref:
        'https://github.com/NABSA/gbfs/blob/master/gbfs.md#free_bike_statusjson'
    },
    with: [
      {
        op: 'add',
        path:
          '/properties/data/properties/bikes/items/properties/vehicle_type_id',
        value: false // @TODO
      }
    ]
  }
})
