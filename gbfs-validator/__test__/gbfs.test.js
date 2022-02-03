const GBFS = require('../gbfs')

describe('initialization', () => {
  test('should correctly initialize validator per default', () => {
    expect(new GBFS('http://localhost:8888/gbfs.json')).toMatchSnapshot()
  })

  test('should correctly initialize validator with options', () => {
    expect(
      new GBFS('http://localhost:8888/gbfs.json', {
        docked: true,
        freefloating: true,
        version: 'v2.1'
      })
    ).toMatchSnapshot()
  })

  test('should throw an error without url', () => {
    expect(() => {
      new GBFS()
    }).toThrowErrorMatchingSnapshot()
  })

  describe('with auth', () => {
    test('should correctly initialize with `basic_auth`', () => {
      expect(
        new GBFS('http://localhost:8888/gbfs.json', {
          auth: {
            type: 'basic_auth',
            basicAuth: {
              user: 'myuser',
              password: 'mypassword'
            }
          }
        })
      ).toMatchSnapshot()
    })

    test('should correctly initialize with `bearer_token`', () => {
      expect(
        new GBFS('http://localhost:8888/gbfs.json', {
          auth: {
            type: 'bearer_token',
            bearerToken: { token: 'mytoken' }
          }
        })
      ).toMatchSnapshot()
    })
  })
})

describe('checkAutodiscovery method', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should autodiscover gbfs.json with the full url', () => {
    const gbfs = new GBFS(
      `http://${gbfsFeedServer.server.address().address}:${
        gbfsFeedServer.server.address().port
      }/gbfs.json`
    )

    return gbfs.checkAutodiscovery().then(result => {
      expect(result).toMatchObject({
        errors: false,
        exists: true,
        file: 'gbfs.json',
        hasErrors: false,
        recommanded: true,
        required: true,
        url: `http://${gbfsFeedServer.server.address().address}:${
          gbfsFeedServer.server.address().port
        }/gbfs.json`
      })
    })
  })

  test('should autodiscover gbfs.json with missing on url', () => {
    const gbfs = new GBFS(
      `http://${gbfsFeedServer.server.address().address}:${
        gbfsFeedServer.server.address().port
      }/`
    )

    return gbfs.checkAutodiscovery().then(result => {
      expect(result).toMatchObject({
        errors: false,
        exists: true,
        file: 'gbfs.json',
        hasErrors: false,
        recommanded: true,
        required: true,
        url: `http://${gbfsFeedServer.server.address().address}:${
          gbfsFeedServer.server.address().port
        }/gbfs.json`
      })
    })
  })

  test('should success if gbfs.json is not found but not required', () => {
    const gbfs = new GBFS(
      `http://${gbfsFeedServer.server.address().address}:${
        gbfsFeedServer.server.address().port
      }/v2/`
    )

    return gbfs.checkAutodiscovery().then(result => {
      expect(result).toMatchObject({
        errors: false,
        exists: false,
        file: 'gbfs.json',
        hasErrors: false,
        recommanded: true,
        required: false,
        url: `http://${gbfsFeedServer.server.address().address}:${
          gbfsFeedServer.server.address().port
        }/v2/gbfs.json`
      })
    })
  })

  test('should success if gbfs.json is not found and required', () => {
    const gbfs = new GBFS(
      `http://${gbfsFeedServer.server.address().address}:${
        gbfsFeedServer.server.address().port
      }/v2/`,
      { version: '2.0' }
    )

    return gbfs.checkAutodiscovery().then(result => {
      expect(result).toMatchObject({
        errors: false,
        exists: false,
        file: 'gbfs.json',
        hasErrors: false,
        recommanded: true,
        required: true,
        url: `http://${gbfsFeedServer.server.address().address}:${
          gbfsFeedServer.server.address().port
        }/v2/gbfs.json`
      })
    })
  })
})

describe('getFile method', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should get file using gbfs.json url', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    gbfs.autoDiscovery = {
      data: {
        en: {
          feeds: [
            {
              name: 'system_information',
              url: `${url}/autodiscovery/system_information.json`
            }
          ]
        }
      }
    }

    return gbfs.getFile('system_information', true).then(result => {
      expect(result).toMatchObject({
        body: expect.any(Array),
        required: true,
        type: 'system_information'
      })

      result.body.forEach(l => {
        expect(l).toMatchObject({
          exists: true,
          lang: 'en',
          body: expect.any(Object)
        })
      })
    })
  })

  test('should get file do not exist using gbfs.json url', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    gbfs.autoDiscovery = {
      data: {
        en: {
          feeds: [
            {
              name: 'system_information',
              url: `${url}/autodiscovery/system_information.json`
            }
          ]
        }
      }
    }

    return gbfs.getFile('do_not_exist', true).then(result => {
      expect(result).toMatchObject({
        body: expect.any(Array),
        required: true,
        type: 'do_not_exist'
      })

      result.body.forEach(l => {
        expect(l).toMatchObject({
          body: null,
          exists: false,
          lang: 'en',
          url: null
        })
      })
    })
  })

  test('should get file without autodiscovery', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}`)

    return gbfs.getFile('system_information', true).then(result => {
      expect(result).toMatchObject({
        required: true,
        exists: true,
        type: 'system_information',
        body: expect.any(Object)
      })
    })
  })

  test('should get file do not exist without autodiscovery', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    return gbfs.getFile('do_not_exist', true).then(result => {
      expect(result).toMatchObject({
        body: null,
        required: true,
        errors: expect.any(Error),
        exists: false,
        type: 'do_not_exist'
      })
    })
  })
})

describe('validationFile method', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate file with no lang', () => {
    const gbfs = new GBFS(`http://localhost/gbfs.json`)

    const result = gbfs.validationFile(
      {
        last_updated: 1566224400,
        ttl: 0,
        version: '2.2',
        data: {
          en: {
            feeds: [
              {
                name: 'system_information',
                url: `http://localhost/system_information.json`
              },
              {
                name: 'station_information',
                url: `http://localhost/station_information.json`
              },
              {
                name: 'station_status',
                url: `http://localhost/station_status.json`
              },
              {
                name: 'free_bike_status',
                url: `http://localhost/free_bike_status.json`
              }
            ]
          }
        }
      },
      '2.2',
      'gbfs',
      true,
      {}
    )

    expect(result).toMatchObject({
      required: true,
      errors: false,
      exists: true,
      file: 'gbfs.json',
      url: 'http://localhost/gbfs.json/gbfs.json'
    })
  })

  test('should validate file with lang', () => {
    const gbfs = new GBFS(`http://localhost/gbfs.json`)

    const result = gbfs.validationFile(
      [
        {
          body: {
            last_updated: 1566224400,
            ttl: 0,
            version: '2.2',
            data: {
              en: {
                feeds: [
                  {
                    name: 'system_information',
                    url: `http://localhost/system_information.json`
                  },
                  {
                    name: 'station_information',
                    url: `http://localhost/station_information.json`
                  },
                  {
                    name: 'station_status',
                    url: `http://localhost/station_status.json`
                  },
                  {
                    name: 'free_bike_status',
                    url: `http://localhost/free_bike_status.json`
                  }
                ]
              }
            }
          },
          exists: true,
          lang: 'en'
        }
      ],
      '2.2',
      'gbfs',
      true,
      {}
    )

    expect(result).toMatchObject({
      languages: expect.any(Array),
      required: true,
      exists: true,
      file: 'gbfs.json',
      hasErrors: false
    })

    result.languages.forEach(l => {
      expect(l).toMatchObject({
        body: expect.any(Object),
        exists: true,
        lang: 'en',
        errors: false
      })
    })
  })
})

describe('validation method', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '2.2', validated: '2.2' },
          hasErrors: true,
          errorsCount: 1
        }),
        files: expect.any(Array)
      })
    })
  })
})

describe('conditional vehicle_types file', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/missing_vehicle_types')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '2.2', validated: '2.2' }
        }),
        files: expect.arrayContaining([
          expect.objectContaining({
            file: 'vehicle_types.json',
            exists: false,
            required: true
          })
        ])
      })
    })
  })
})

describe('conditional required vehicle_type_id', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/conditionnal_vehicle_type_id')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '2.2', validated: '2.2' },
          hasErrors: true,
          errorsCount: 2
        }),
        files: expect.arrayContaining([
          expect.objectContaining({
            file: 'free_bike_status.json',
            languages: expect.arrayContaining([
              expect.objectContaining({
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    instancePath: '/data/bikes/0',
                    message:
                      "'vehicle_type_id' is required for this vehicle type"
                  }),
                  expect.objectContaining({
                    instancePath: '/data/bikes/2',
                    message:
                      "must have required property 'current_range_meters'"
                  })
                ])
              })
            ])
          })
        ])
      })
    })
  })
})

describe('conditional no required vehicle_type_id', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/conditionnal_no_vehicle_type_id')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '2.2', validated: '2.2' }
        }),
        files: expect.arrayContaining([
          expect.objectContaining({
            file: 'vehicle_types.json',
            exists: false,
            required: true
          })
        ])
      })
    })
  })
})

describe('conditional required vehicle_types_available', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/conditionnal_vehicle_types_available')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      const file = result.files.find(f => f.file === 'station_status.json')
      const errors = file.languages.map(l => l.errors)

      expect(errors).toMatchObject([
        [
          {
            instancePath: '/data/stations/0',
            schemaPath: '#/properties/data/properties/stations/items/required',
            keyword: 'required',
            params: {
              missingProperty: 'vehicle_types_available'
            },
            message: "must have required property 'vehicle_types_available'"
          }
        ]
      ])
    })
  })
})
