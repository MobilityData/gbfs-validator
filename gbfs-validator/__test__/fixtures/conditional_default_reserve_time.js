const fastify = require('fastify')

function build(opts = {}) {
  const app = fastify(opts)

  app.get('/gbfs.json', async function(request, reply) {
    return {
      last_updated: "2024-05-23T15:30:00Z",
      ttl: 0,
      version: '3.1-RC2',
      data: {
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
              name: 'vehicle_types',
              url: `http://${request.hostname}/vehicle_types.json`
            },
            {
              name: 'system_pricing_plans',
              url: `http://${request.hostname}/system_pricing_plans.json`
            },
          ]
        
      }
    }
  })

  app.get('/system_information.json', async function(request, reply) {
    return {
      last_updated: "2024-05-23T15:30:00Z",
      ttl: 0,
      version: '3.1-RC',
      data: {
        system_id: 'shared_bike',
        name: [
          {
            text: 'Shared Bike USA',
            language: 'en'
          }
        ],
        timezone: 'Etc/UTC',
        opening_hours: "Mo-Fr 08:00-17:00",
        feed_contact_email: "gg@gmail.com",
        languages: ["en"]
      }
    }
  })

  app.get('/vehicle_types.json', async function(request, reply) {
    return {
      last_updated: "2024-05-23T15:30:00Z",
      ttl: 0,
      version: '3.1-RC2',
      data: {
        vehicle_types: [
          {
            // default_reserve_time is required
            vehicle_type_id: 'abc123',
            form_factor: 'scooter',
            propulsion_type: 'human',
            name: [
              {
                text: 'Example Bicycle',
                language: 'en'
              }
            ],
            //default_reserve_time: 30, // should throw error
            return_type: ['any_station', 'free_floating'],
            vehicle_assets: {
              icon_url: 'https://www.example.com/assets/icon_bicycle.svg',
              icon_url_dark:
                'https://www.example.com/assets/icon_bicycle_dark.svg',
              icon_last_modified: '2021-06-15'
            },
            default_pricing_plan_id: 'car_plan_2',
            pricing_plan_ids: ['car_plan_2', 'car_plan_1']
          },
          {
            // default_reserve_time is required
            vehicle_type_id: 'efg456',
            form_factor: 'car',
            propulsion_type: 'electric',
            name: [
              {
                text: 'Example Electric Car',
                language: 'en'
              }
            ],
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
          },
          {
            // default_reserve_time is NOT required
            vehicle_type_id: 'efg4567',
            form_factor: 'car',
            propulsion_type: 'electric',
            name: [
              {
                text: 'Example Electric Car 2',
                language: 'en'
              }
            ],
            //default_reserve_time: 30,
            max_range_meters: 100,
            return_type: ['any_station', 'free_floating'],
            vehicle_assets: {
              icon_url: 'https://www.example.com/assets/icon_car.svg',
              icon_url_dark: 'https://www.example.com/assets/icon_car_dark.svg',
              icon_last_modified: '2021-06-15'
            },
            default_pricing_plan_id: 'car_plan_2',
            pricing_plan_ids: ['car_plan_2']
          }
        ]
      }
    }
  })

  app.get('/system_pricing_plans.json', async function(request, reply) {
    return {
      last_updated: "2024-05-23T15:30:00Z",
      ttl: 0,
      version: '3.1-RC2',
      data: {
        plans: [
          {
            plan_id: 'car_plan_1',
            name: [
              {
                text: 'Basic',
                language: 'en'
              }
            ],
            currency: 'USD',
            price: 0,
            is_taxable: false,
            description: [
              {
                text: 'Basic plan',
                language: 'en'
              }
            ],
            reservation_price_per_min: 3
          },
          {
            plan_id: 'car_plan_2',
            name: [
              {
                text: 'Basic 2',
                language: 'en'
              }
            ],
            currency: 'USD',
            price: 0,
            is_taxable: false,
            description: [
              {
                text: 'Basic plan',
                language: 'en'
              }
            ],
          },
          {
            plan_id: 'car_plan_3',
            name: [
              {
                text: 'Basic 3',
                language: 'en'
              }
            ],
            currency: 'USD',
            price: 0,
            is_taxable: false,
            description: [
              {
                text: 'Basic plan',
                language: 'en'
              }
            ],
            reservation_price_flat_rate: 5
          },
          {
            plan_id: 'car_plan_4',
            name: [
              {
                text: 'Basic 4',
                language: 'en'
              }
            ],
            currency: 'USD',
            price: 0,
            is_taxable: false,
            description: [
              {
                text: 'Basic plan',
                language: 'en'
              }
            ],
            reservation_price_flat_rate: 5,
            reservation_price_per_min: 3 // this should throw an error
          }
        ]
      }
    }
  })

  return app
}

module.exports = build
