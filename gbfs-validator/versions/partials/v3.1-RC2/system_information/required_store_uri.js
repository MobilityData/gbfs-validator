module.exports = ({ android = false, ios = false }) => {
  const partial = {
    $id: 'required_ios_store_uri.json#',
    $patch: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/system_information.json'
      },
      with: [
        {
          op: 'add',
          path: '/properties/data/required/0',
          value: 'rental_apps'
        }
      ]
    },
    $merge: {
      source: {
        $ref: 'https://github.com/MobilityData/gbfs-json-schema/blob/master/v3.1-RC2/system_information.json'
      },
      with: {
        properties: {
          data: {
            properties: {
              rental_apps: {
                required: [],
                properties: {
                  ios: {
                    required: []
                  },
                  android: {
                    required: []
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  if (ios) {
    partial.$merge.with.properties.data.properties.rental_apps.required.push(
      'ios'
    )
    partial.$merge.with.properties.data.properties.rental_apps.properties.ios.required.push(
      'store_uri'
    )
  }

  if (android) {
    partial.$merge.with.properties.data.properties.rental_apps.required.push(
      'android'
    )
    partial.$merge.with.properties.data.properties.rental_apps.properties.android.required.push(
      'store_uri'
    )
  }

  return partial
}
