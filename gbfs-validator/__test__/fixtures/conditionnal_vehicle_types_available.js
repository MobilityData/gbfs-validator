const fastify = require('fastify')

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
              name: 'vehicle_types',
              url: `http://${request.hostname}/vehicle_types.json`
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
        timezone: 'UTC'
      }
    }
  })

  app.get('/vehicle_types.json', async function(request, reply) {
    return {
      last_updated: 1566224400,
      ttl: 0,
      version: '2.2',
      data: {
        vehicle_types: [
          {
            vehicle_type_id: 'abc123',
            form_factor: 'bicycle',
            propulsion_type: 'human',
            name: 'Example Basic Bike',
            default_reserve_time: 30,
            return_type: ['any_station', 'free_floating'],
            vehicle_assets: {
              icon_url: 'https://www.example.com/assets/icon_bicycle.svg',
              icon_url_dark:
                'https://www.example.com/assets/icon_bicycle_dark.svg',
              icon_last_modified: '2021-06-15'
            },
            default_pricing_plan_id: 'bike_plan_1',
            pricing_plan_ids: ['bike_plan_1', 'bike_plan_2', 'bike_plan_3']
          },
          {
            vehicle_type_id: 'efg456',
            form_factor: 'car',
            propulsion_type: 'electric',
            name: 'Example Electric Car',
            default_reserve_time: 30,
            max_range_meters: 100,
            return_type: ['any_station', 'free_floating'],
            vehicle_assets: {
              icon_url: 'https://www.example.com/assets/icon_car.svg',
              icon_url_dark: 'https://www.example.com/assets/icon_car_dark.svg',
              icon_last_modified: '2021-06-15'
            },
            default_pricing_plan_id: 'car_plan_1',
            pricing_plan_ids: ['car_plan_1', 'car_plan_2', 'car_plan_3']
          }
        ]
      }
    }
  })

  app.get('/station_status.json', async function(request, reply) {
    return {
      last_updated: 1566224400,
      ttl: 0,
      version: '2.2',
      data: {
        stations: [
          {
            station_id: 'abc123',
            num_bikes_available: 0,
            is_installed: true,
            is_renting: true,
            is_returning: true,
            last_reported: 1566224400
            // missing vehicle_types_available
          },
          {
            station_id: 'abc123',
            num_bikes_available: 0,
            is_installed: true,
            is_renting: true,
            is_returning: true,
            last_reported: 1566224400,
            vehicle_types_available: [
              {
                vehicle_type_id: 'abc456',
                count: 2
              }
            ]
          }
        ]
      }
    }
  })

  return app
}

module.exports = build
