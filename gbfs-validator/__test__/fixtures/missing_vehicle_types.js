const fastify = require('fastify')

const last_updated_fresh = Math.floor(Date.now() / 1000) - 30

function build(opts = {}) {
  const app = fastify(opts)

  app.get('/gbfs.json', async function(request, reply) {
    return {
      last_updated: 1566224400,
      ttl: 0,
      version: '2.2',
      data: {
        en: {
          feeds: [
            {
              name: 'system_information',
              url: `http://${request.hostname}/system_information.json`
            },
            {
              name: 'station_information',
              url: `http://${request.hostname}/station_information.json`
            },
            {
              name: 'station_status',
              url: `http://${request.hostname}/station_status.json`
            },
            {
              name: 'free_bike_status',
              url: `http://${request.hostname}/free_bike_status.json`
            }
          ]
        }
      }
    }
  })

  app.get('/system_information.json', async function(request, reply) {
    return {
      last_updated: 1566224400,
      ttl: 0,
      version: '2.2',
      data: {
        system_id: 'shared_bike',
        language: 'en',
        name: 'Shared Bike USA',
        timezone: 'Etc/UTC'
      }
    }
  })

  app.get('/free_bike_status.json', async function(request, reply) {
    return {
      last_updated: last_updated_fresh,
      ttl: 0,
      version: '2.2',
      data: {
        bikes: [
          {
            bike_id: 'ghi789',
            last_reported: 1609866109,
            lat: 12.345678,
            lon: 56.789012,
            is_reserved: false,
            is_disabled: false,
            vehicle_type_id: 'abc123'
          }
        ]
      }
    }
  })

  return app
}

module.exports = build
