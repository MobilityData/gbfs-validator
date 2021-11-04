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

describe('checkFile method', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()

    await gbfsFeedServer.listen()

    return gbfsFeedServer
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should check file using gbfs.json url', () => {
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

    return gbfs.checkFile('2.2', 'system_information', true).then(result => {
      expect(result).toMatchObject({
        languages: expect.any(Array),
        required: true,
        exists: true,
        file: 'system_information.json',
        hasErrors: false
      })

      result.languages.forEach(l => {
        expect(l).toMatchObject({
          errors: false,
          exists: true,
          lang: 'en',
          url: `http://${gbfsFeedServer.server.address().address}:${
            gbfsFeedServer.server.address().port
          }/autodiscovery/system_information.json`
        })
      })
    })
  })

  test('should check file do not exist using gbfs.json url', () => {
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

    return gbfs.checkFile('2.2', 'do_not_exist', true).then(result => {
      expect(result).toMatchObject({
        languages: expect.any(Array),
        required: true,
        exists: false,
        file: 'do_not_exist.json',
        hasErrors: true
      })

      result.languages.forEach(l => {
        expect(l).toMatchObject({
          errors: false,
          exists: false,
          lang: 'en',
          url: null
        })
      })
    })
  })

  test('should check file without autodiscovery', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}`)

    return gbfs.checkFile('2.2', 'system_information', true).then(result => {
      expect(result).toMatchObject({
        required: true,
        exists: true,
        file: 'system_information.json',
        errors: [
          {
            instancePath: '/data',
            keyword: 'required',
            message: "must have required property 'language'",
            params: {
              missingProperty: 'language'
            },
            schemaPath: '#/properties/data/required'
          }
        ]
      })
    })
  })

  test('should check file do not exist without autodiscovery', () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    return gbfs.checkFile('2.2', 'do_not_exist', true).then(result => {
      expect(result).toMatchObject({
        required: true,
        exists: false,
        file: 'do_not_exist.json',
        errors: expect.any(Error)
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
