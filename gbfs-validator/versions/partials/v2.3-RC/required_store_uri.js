module.exports = ({ android = false, ios = false }) => {
  const r = {
    $id: 'required_ios_store_uri.json#',
    $patch: {
      source: {
        $ref:
          'https://github.com/NABSA/gbfs/blob/v2.3-RC/gbfs.md#system_informationjson'
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
        $ref:
          'https://github.com/NABSA/gbfs/blob/v2.3-RC/gbfs.md#system_informationjson'
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
    r.$merge.with.properties.data.properties.rental_apps.required.push('ios')
    r.$merge.with.properties.data.properties.rental_apps.properties.ios.required.push(
      'store_uri'
    )
  }

  if (android) {
    r.$merge.with.properties.data.properties.rental_apps.required.push(
      'android'
    )
    r.$merge.with.properties.data.properties.rental_apps.properties.android.required.push(
      'store_uri'
    )
  }

  return r
}
