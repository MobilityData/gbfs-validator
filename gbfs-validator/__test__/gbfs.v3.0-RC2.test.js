const GBFS = require('../gbfs')

const serverOpts = {
  port: 0,
  host: '127.0.0.1',
}

function get_errors(result) {
  let errors = []

  result.files?.map(f => {
    if (f.errors) {
      errors.push({ file: f.file, errors: f.errors })
    }

    f.languages?.map(l => {
      if (l.errors) {
        errors.push({ file: f.file, lang: l.lang, errors: l.errors })
      }
    })
  })

  return errors
}

describe('default feed', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC2/default')
    let mockRequests = new MockRequests()

    gbfsFeedServer = mockRequests.build()

    await gbfsFeedServer.listen(serverOpts)
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', async () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(1)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC2', validated: '3.0-RC2' },
          hasErrors: false
        }),
        files: expect.any(Array)
      })
    })
  })
})

describe('invalid feed', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC2/default')
    class InvalidMockRequests extends MockRequests {
      system_information(...args) {
        const json = super.system_information(...args)

        delete json.data.name

        return json
      }
    }

    let mockRequests = new InvalidMockRequests()

    gbfsFeedServer = mockRequests.build()

    await gbfsFeedServer.listen(serverOpts)
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should not validate feed', async () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(2)

    return gbfs.validation().then(result => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC2', validated: '3.0-RC2' },
          hasErrors: true,
          errorsCount: 1
        }),
        files: expect.any(Array)
      })

      let error = result.files.find(f => f.file === 'system_information.json')
        ?.languages?.[0].errors?.[0].schemaPath
      expect(error).toBe('#/properties/data/required')
    })
  })
})

describe('exaustive feed', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC2/exaustive')

    let mockRequests = new MockRequests()

    gbfsFeedServer = mockRequests.build()

    await gbfsFeedServer.listen(serverOpts)
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should validate feed', async () => {
    const url = `http://${gbfsFeedServer.server.address().address}:${
      gbfsFeedServer.server.address().port
    }`
    const gbfs = new GBFS(`${url}/gbfs.json`)

    expect.assertions(2)

    return gbfs.validation().then(result => {
      expect(get_errors(result)).toEqual([])

      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC2', validated: '3.0-RC2' },
          hasErrors: false
        }),
        files: expect.any(Array)
      })
    })
  })
})
