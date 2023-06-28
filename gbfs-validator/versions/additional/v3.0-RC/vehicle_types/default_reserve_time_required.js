module.exports = ({ vehicle_type_ids }) => ({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'default_reserve_time',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        vehicle_types: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              vehicle_type_id: {
                type: 'string'
              },
              default_reserve_time: {
                type: 'integer'
              }
            },
            if: {
              properties: { vehicle_type_id: { enum: vehicle_type_ids } },
              required: ['vehicle_type_id']
            },
            then: { required: ['default_reserve_time'] }
          }
        }
      }
    }
  }
})
