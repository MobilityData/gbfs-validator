const fastify = require('fastify')

const version = '3.0-RC2'
const last_updated = '2019-08-19T10:20:00-04:00'
const last_updated_fresh = new Date().toISOString()

class MockRequests {
  entry_points() {
    return {
      manifest: this.manifest,
      gbfs: this.gbfs,
      gbfs_versions: this.gbfs_versions,
      system_information: this.system_information,
      vehicle_types: this.vehicle_types,
      station_status: this.station_status,
      vehicle_status: this.vehicle_status
    }
  }

  manifest({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        datasets: [
          {
            system_id: 'example_berlin',
            versions: [
              {
                version: '3.0-RC2',
                url: `${basePath}/gbfs.json`
              }
            ]
          }
        ]
      }
    }
  }

  gbfs({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        feeds: [
          {
            name: 'system_information',
            url: `${basePath}/system_information.json`
          },
          {
            name: 'vehicle_types',
            url: `${basePath}/vehicle_types.json`
          },
          {
            name: 'vehicle_status',
            url: `${basePath}/vehicle_status.json`
          }
        ]
      }
    }
  }

  gbfs_versions({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        versions: [
          {
            version: '3.0-RC2',
            url: `${basePath}/gbfs.json`
          }
        ]
      }
    }
  }

  system_information() {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        system_id: 'shared_bike',
        languages: ['en'],
        name: [
          {
            text: 'Shared Bike USA',
            language: 'en'
          }
        ],
        timezone: 'Etc/UTC',
        opening_hours: 'Mo-Su 00:00-23:59',
        feed_contact_email: 'datafeed@example.com'
      }
    }
  }

  vehicle_types() {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        vehicle_types: [
          {
            vehicle_type_id: 'biketype1',
            form_factor: 'bicycle',
            propulsion_type: 'human',
            name: [
              {
                text: 'Example Basic Bike',
                language: 'en'
              }
            ],
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
            vehicle_type_id: 'cartype1',
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
          }
        ]
      }
    }
  }

  vehicle_status() {
    return {
      last_updated: last_updated_fresh,
      ttl: 0,
      version,
      data: {
        vehicles: [
          {
            vehicle_id: 'bike1',
            last_reported: last_updated,
            lat: 12.345678,
            lon: 56.789012,
            is_reserved: false,
            is_disabled: false,
            vehicle_type_id: 'biketype1'
          },
          {
            vehicle_id: 'car1',
            last_reported: last_updated,
            lat: 12.345678,
            lon: 56.789012,
            is_reserved: false,
            is_disabled: false,
            vehicle_type_id: 'cartype1',
            current_range_meters: 10
          }
        ]
      }
    }
  }

  build() {
    const app = fastify()

    const data = this.entry_points()

    const keys = Object.keys(data)

    for (const key of keys) {
      app.get(`/${key}.json`, async function(request) {
        const basePath = `http://${request.hostname}`

        return data[key]({ request, basePath })
      })
    }

    return app
  }
}

module.exports = {
  MockRequests
}
