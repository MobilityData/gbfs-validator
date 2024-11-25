const fastify = require('fastify')

const version = '3.0'
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
      vehicle_status: this.vehicle_status,
      station_status: this.station_status,
      station_information: this.station_information,
      system_regions: this.system_regions,
      system_pricing_plans: this.system_pricing_plans,
      system_alerts: this.system_alerts,
      geofencing_zones: this.geofencing_zones
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
                version: '3.0',
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
            name: 'gbfs_versions',
            url: `${basePath}/gbfs_versions.json`
          },
          {
            name: 'vehicle_types',
            url: `${basePath}/vehicle_types.json`
          },
          {
            name: 'vehicle_status',
            url: `${basePath}/vehicle_status.json`
          },
          {
            name: 'station_information',
            url: `${basePath}/station_information.json`
          },
          {
            name: 'station_status',
            url: `${basePath}/station_status.json`
          },
          {
            name: 'system_regions',
            url: `${basePath}/system_regions.json`
          },
          {
            name: 'system_pricing_plans',
            url: `${basePath}/system_pricing_plans.json`
          },
          {
            name: 'system_alerts',
            url: `${basePath}/system_alerts.json`
          },
          {
            name: 'geofencing_zones',
            url: `${basePath}/geofencing_zones.json`
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
            version: '3.0',
            url: `${basePath}/gbfs.json`
          }
        ]
      }
    }
  }

  system_information({ basePath }) {
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
        opening_hours: 'Mo-Su 00:00-23:59',
        short_name: [
          {
            text: 'SB-USA',
            language: 'en'
          }
        ],
        operator: [
          {
            text: 'Shared Bike',
            language: 'en'
          }
        ],
        url: 'https://www.example.com',
        purchase_url: 'https://www.example.com',
        start_date: '2019-01-13',
        phone_number: '+18005551234',
        email: 'customerservice@example.com',
        feed_contact_email: 'datafeed@example.com',
        manifest_url: `${basePath}/manifest.json`,
        timezone: 'America/Montreal',
        license_id: 'CC-BY-4.0',
        attribution_organization_name: [
          {
            text: 'Shared Bike',
            language: 'en'
          }
        ],
        attribution_url: 'https://www.example.com',
        brand_assets: {
          brand_last_modified: '2021-06-15',
          brand_image_url: 'https://www.example.com/assets/brand_image.svg',
          brand_image_url_dark:
            'https://www.example.com/assets/brand_image_dark.svg',
          color: '#C2D32C',
          brand_terms_url: 'https://www.example.com/assets/brand.pdf'
        },
        terms_url: [
          {
            text: 'https://www.example.com/en/terms',
            language: 'en'
          }
        ],
        terms_last_updated: '2021-06-21',
        privacy_url: [
          {
            text: 'https://www.example.com/en/privacy-policy',
            language: 'en'
          }
        ],
        privacy_last_updated: '2019-01-13',
        rental_apps: {
          android: {
            store_uri:
              'https://play.google.com/store/apps/details?id=com.example.android',
            discovery_uri: 'com.example.android://'
          },
          ios: {
            store_uri: 'https://apps.apple.com/app/apple-store/id123456789',
            discovery_uri: 'com.example.ios://'
          }
        }
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
            rider_capacity: 1,
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
            default_pricing_plan_id: 'plan2',
            pricing_plan_ids: ['plan2', 'plan3']
          },
          {
            vehicle_type_id: 'cartype1',
            form_factor: 'car',
            cargo_volume_capacity: 50,
            cargo_load_capacity: 100,
            propulsion_type: 'electric',
            eco_labels: [
              {
                country_code: 'FR',
                eco_sticker: 'critair_1'
              }
            ],
            max_range_meters: 10000,
            name: [
              {
                text: 'Example Electric Car',
                language: 'en'
              }
            ],
            vehicle_accessories: ['automatic', 'air_conditioning'],
            g_CO2_km: 0,
            default_reserve_time: 30,
            return_type: ['any_station', 'free_floating'],
            vehicle_image: 'https://www.example.com/assets/car.jpg',
            make: [
              {
                text: 'Example Car Manufacturer',
                language: 'en'
              }
            ],
            model: [
              {
                text: 'Example Car Model',
                language: 'en'
              }
            ],
            color: 'dark blue',
            description: [
              {
                text: 'Example Car Description',
                language: 'en'
              }
            ],
            wheel_count: 4,
            max_permitted_speed: 200,
            rated_power: 100,
            default_reserve_time: 30,
            return_constraint: 'hybrid',
            vehicle_assets: {
              icon_url: 'https://www.example.com/assets/icon_car.svg',
              icon_url_dark: 'https://www.example.com/assets/icon_car_dark.svg',
              icon_last_modified: '2021-06-15'
            },
            default_pricing_plan_id: 'plan3',
            pricing_plan_ids: ['plan3']
          }
        ]
      }
    }
  }

  station_information({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        stations: [
          {
            station_id: 'pga',
            name: [
              {
                text: 'Parking garage A',
                language: 'en'
              }
            ],
            short_name: [
              {
                text: 'PGA',
                language: 'en'
              }
            ],
            lat: 12.345678,
            lon: 45.678901,
            address: '1234 Main Street',
            cross_street: '2nd Street',
            region_id: 'region1',
            post_code: '12345',
            station_opening_hours: 'Su-Th 05:00-22:00; Fr-Sa 05:00-01:00',
            rental_methods: ['creditcard', 'phone'],
            is_virtual_station: true,
            station_area: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [-122.655775, 45.516445],
                    [-122.655705, 45.516445],
                    [-122.655705, 45.516495],
                    [-122.655775, 45.516495],
                    [-122.655775, 45.516445]
                  ]
                ]
              ]
            },
            parking_type: 'underground_parking',
            parking_hoop: false,
            contact_phone: '+33109874321',
            capacity: 10,
            vehicle_types_capacity: [
              {
                vehicle_type_ids: ['abc123'],
                count: 7
              },
              {
                vehicle_type_ids: ['def456'],
                count: 3
              }
            ],
            vehicle_docks_capacity: [
              {
                vehicle_type_ids: ['abc123'],
                count: 7
              },
              {
                vehicle_type_ids: ['def456'],
                count: 3
              }
            ],
            is_valet_station: true,
            is_charging_station: true,
            rental_uris: {
              android:
                'https://www.example.com/app?sid=1234567890&platform=android',
              ios: 'https://www.example.com/app?sid=1234567890&platform=ios',
              web: 'https://www.example.com/app?sid=1234567890'
            }
          }
        ]
      }
    }
  }

  station_status({ basePath }) {
    return {
      last_updated: last_updated_fresh,
      ttl: 0,
      version,
      data: {
        stations: [
          {
            station_id: 'station1',
            is_installed: true,
            is_renting: true,
            is_returning: true,
            last_reported: last_updated,
            num_docks_available: 3,
            num_docks_disabled: 1,
            vehicle_docks_available: [
              {
                vehicle_type_ids: ['biketype1', 'cartype1'],
                count: 2
              },
              {
                vehicle_type_ids: ['cartype1'],
                count: 1
              }
            ],
            num_vehicles_available: 1,
            num_vehicles_disabled: 2,
            vehicle_types_available: [
              {
                vehicle_type_id: 'biketype1',
                count: 1
              },
              {
                vehicle_type_id: 'cartype1',
                count: 0
              }
            ]
          },
          {
            station_id: 'station2',
            is_installed: true,
            is_renting: true,
            is_returning: true,
            last_reported: last_updated,
            num_docks_available: 8,
            num_docks_disabled: 1,
            vehicle_docks_available: [
              {
                vehicle_type_ids: ['biketype1'],
                count: 6
              },
              {
                vehicle_type_ids: ['cartype1'],
                count: 2
              }
            ],
            num_vehicles_available: 6,
            num_vehicles_disabled: 1,
            vehicle_types_available: [
              {
                vehicle_type_id: 'biketype1',
                count: 2
              },
              {
                vehicle_type_id: 'cartype1',
                count: 4
              }
            ]
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
            lat: 12.345678,
            lon: 56.789012,
            is_reserved: false,
            is_disabled: false,
            rental_uris: {
              android:
                'https://www.example.com/app?vehicle_id=973a5c94-c288-4a2b-afa6-de8aeb6ae2e5&platform=android&',
              ios:
                'https://www.example.com/app?vehicle_id=973a5c94-c288-4a2b-afa6-de8aeb6ae2e5&platform=ios',
              web: 'https://www.example.com/app?sid=1234567890'
            },
            vehicle_type_id: 'biketype1',
            last_reported: last_updated
          },
          {
            vehicle_id: 'car1',
            lat: 12.345678,
            lon: 56.789012,
            is_reserved: false,
            is_disabled: false,
            vehicle_type_id: 'cartype1',
            last_reported: last_updated,
            current_range_meters: 10000,
            current_fuel_percent: 0.5,
            station_id: 'station1',
            home_station_id: 'station1',
            pricing_plan_id: 'plan3',
            vehicle_equipment: ['winter_tires'],
            available_until: '2021-05-17T15:00:00Z'
          }
        ]
      }
    }
  }

  system_regions({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        regions: [
          {
            name: [
              {
                text: 'North',
                language: 'en'
              }
            ],
            region_id: 'region3'
          },
          {
            name: [
              {
                text: 'East',
                language: 'en'
              }
            ],
            region_id: 'region4'
          },
          {
            name: [
              {
                text: 'South',
                language: 'en'
              }
            ],
            region_id: 'region5'
          },
          {
            name: [
              {
                text: 'West',
                language: 'en'
              }
            ],
            region_id: 'region6'
          }
        ]
      }
    }
  }

  system_pricing_plans({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        plans: [
          {
            plan_id: 'plan2',
            url: 'https://www.example.com/pricing/plan2',
            name: [
              {
                text: 'One-Way',
                language: 'en'
              }
            ],
            currency: 'USD',
            price: 2.0,
            is_taxable: false,
            description: [
              {
                text: 'Includes 10km, overage fees apply after 10km.',
                language: 'en'
              }
            ],
            per_km_pricing: [
              {
                start: 10,
                rate: 1.0,
                interval: 1,
                end: 25
              },
              {
                start: 25,
                rate: 0.5,
                interval: 1
              },
              {
                start: 25,
                rate: 3.0,
                interval: 5
              }
            ],
            surge_pricing: false
          },
          {
            plan_id: 'plan3',
            name: [
              {
                text: 'Simple Rate',
                language: 'en'
              }
            ],
            currency: 'CAD',
            price: 3.0,
            is_taxable: true,
            description: [
              {
                text: '$3 unlock fee, $0.25 per kilometer and 0.50 per minute.',
                language: 'en'
              }
            ],
            per_km_pricing: [
              {
                start: 0,
                rate: 0.25,
                interval: 1
              }
            ],
            per_min_pricing: [
              {
                start: 0,
                rate: 0.5,
                interval: 1
              }
            ],
            surge_pricing: false
          }
        ]
      }
    }
  }

  system_alerts({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        alerts: [
          {
            alert_id: '21',
            type: 'station_closure',
            times: [
              {
                start: last_updated,
                end: last_updated_fresh
              }
            ],
            station_ids: ['123', '456', '789'],
            url: [
              {
                text: 'https://example.com/more-info',
                language: 'en'
              }
            ],
            region_ids: ['region1', 'region2'],
            url: [
              {
                text: 'https://example.com/more-info',
                language: 'en'
              }
            ],
            summary: [
              {
                text: 'Disruption of Service',
                language: 'en'
              }
            ],
            description: [
              {
                text:
                  'The three stations on Broadway will be out of service from 12:00am Nov 3 to 3:00pm Nov 6th to accommodate road work',
                language: 'en'
              }
            ],
            last_updated
          }
        ]
      }
    }
  }

  geofencing_zones({ basePath }) {
    return {
      last_updated,
      ttl: 0,
      version,
      data: {
        geofencing_zones: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'MultiPolygon',
                coordinates: [
                  [
                    [
                      [-122.578067, 45.562982],
                      [-122.661838, 45.562741],
                      [-122.661151, 45.504542],
                      [-122.578926, 45.5046625],
                      [-122.578067, 45.562982]
                    ]
                  ],
                  [
                    [
                      [-122.65068, 45.548197],
                      [-122.650852, 45.534731],
                      [-122.630939, 45.535212],
                      [-122.630424, 45.548197],
                      [-122.65068, 45.548197]
                    ]
                  ]
                ]
              },
              properties: {
                name: [
                  {
                    text: 'NE 24th/NE Knott',
                    language: 'en'
                  }
                ],
                start: last_updated,
                end: last_updated_fresh,
                rules: [
                  {
                    vehicle_type_ids: ['moped1', 'car1'],
                    ride_start_allowed: false,
                    ride_end_allowed: false,
                    ride_through_allowed: true,
                    maximum_speed_kph: 10,
                    station_parking: true
                  }
                ]
              }
            }
          ]
        },
        global_rules: [
          {
            ride_start_allowed: false,
            ride_end_allowed: false,
            ride_through_allowed: true
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
