const fastify = require('fastify')

function build(opts = {}) {
  const app = fastify(opts)

  const version = '3.0'
  const lastUpdated = new Date().toISOString()

  app.get('/gbfs.json', async function(request) {
    const base =
      `http://${request.hostname}`

    return {
      last_updated: lastUpdated,
      ttl: 0,
      version,
      data: {
        feeds: [
          {
            name: 'system_information',
            url: `${base}/system_information.json`
          },
          {
            name: 'vehicle_types',
            url: `${base}/vehicle_types.json`
          },
          {
            name: 'vehicle_status',
            url: `${base}/vehicle_status.json`
          }
        ]
      }
    }
  })

  app.get('/system_information.json', async function() {
    return {
      last_updated: lastUpdated,
      ttl: 0,
      version,
      data: {
        system_id: 'vehicle-type-reference-test',
        languages: ['en'],
        name: [
          {
            text: 'Vehicle type reference test',
            language: 'en'
          }
        ],
        timezone: 'Etc/UTC',
        opening_hours: 'Mo-Su 00:00-23:59',
        feed_contact_email: 'test@example.com'
      }
    }
  })

  app.get('/vehicle_types.json', async function() {
    return {
      last_updated: lastUpdated,
      ttl: 0,
      version,
      data: {
        vehicle_types: [
          {
            vehicle_type_id: 'defined_bike',
            form_factor: 'bicycle',
            propulsion_type: 'human',
            name: [
              {
                text: 'Defined Bike',
                language: 'en'
              }
            ],
            return_type: ['free_floating']
          }
        ]
      }
    }
  })

  app.get('/vehicle_status.json', async function() {
    return {
      last_updated: lastUpdated,
      ttl: 0,
      version,
      data: {
        vehicles: [
          {
            vehicle_id: 'vehicle1',
            lat: 51.5,
            lon: -0.1,
            is_reserved: false,
            is_disabled: false,
            vehicle_type_id: 'undefined_type'
          }
        ]
      }
    }
  })

  return app
}

module.exports = build
