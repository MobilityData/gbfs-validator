const GBFS = require('../gbfs')

const serverOpts = {
  port: 0,
  host: '127.0.0.1',
}

function get_errors(result) {
  let errors = []
  let nonSchemaErrors = []
  let warnings = []

  result.files?.map((f) => {
    if (f.errors?.length) {
      errors.push({ file: f.file, errors: f.errors })
    }

    if (f.nonSchemaErrors?.length) {
      nonSchemaErrors.push({ file: f.file, errors: f.nonSchemaErrors })
    }

    if (f.warnings?.length) {
      warnings.push({ file: f.file, warnings: f.warnings })
    }

    f.languages?.map((l) => {
      if (l.errors?.length) {
        errors.push({ file: f.file, lang: l.lang, errors: l.errors })
      }

      if (l.nonSchemaErrors?.length) {
        nonSchemaErrors.push({ file: f.file, lang: l.lang, errors: l.nonSchemaErrors })
      }

      if (l.warnings?.length) {
        warnings.push({ file: f.file, lang: l.lang, warnings: l.warnings })
      }
    })
  })

  return { errors, nonSchemaErrors, warnings }
}

describe('default feed', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC/default')
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

    return gbfs.validation().then((result) => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC', validated: '3.0-RC' },
          validatorVersion: '1.0.0',
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
    const { MockRequests } = require('./fixtures/v3.0-RC/default')
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

    return gbfs.validation().then((result) => {
      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC', validated: '3.0-RC' },
          validatorVersion: '1.0.0',
          hasErrors: true,
          errorsCount: 1
        }),
        files: expect.any(Array)
      })

      let error = result.files.find((f) => f.file === 'system_information.json')
        ?.languages?.[0].errors?.[0].schemaPath
      expect(error).toBe('#/properties/data/required')
    })
  })
})

describe('exaustive feed', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC/exaustive')

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

    return gbfs.validation().then((result) => {
      expect(get_errors(result)).toEqual({
        errors: [],
        nonSchemaErrors: [],
        warnings: []
      })

      expect(result).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '3.0-RC', validated: '3.0-RC' },
          validatorVersion: '1.0.0',
          hasErrors: false
        }),
        files: expect.any(Array)
      })
    })
  })
})

describe('default_reserve_time REQUIRED if reservation_price_per_min or reservation_price_flat_rate are defined', () => {
  let gbfsFeedServer

  beforeAll(async () => {
    const { MockRequests } = require('./fixtures/v3.0-RC/exaustive')

    class InvalidMockRequests extends MockRequests {
      system_pricing_plans(...args) {
        const json = super.system_pricing_plans(...args)

        // This plan with require a default_reserve_time on vehicle_types using it.
        json.data.plans[0].reservation_price_per_min = 1
        json.data.plans[0].reservation_price_flat_rate = 2

        // This plan will not.
        delete json.data.plans[1].reservation_price_per_min
        delete json.data.plans[1].reservation_price_flat_rate

        return json
      }

      vehicle_types(...args) {
        const json = super.vehicle_types(...args)

        const system_pricing_plans = super.system_pricing_plans(...args)
        let id_requiring = system_pricing_plans.data.plans[0].plan_id
        let id_not_requiring = system_pricing_plans.data.plans[1].plan_id

        // This invalid vehicle_type will require a default_reserve_time.
        delete json.data.vehicle_types[0].default_reserve_time
        json.data.vehicle_types[0].default_pricing_plan_id = id_requiring
        json.data.vehicle_types[0].pricing_plan_ids = [
          id_requiring,
          id_not_requiring
        ]

        // This valid vehicle_type will not.
        delete json.data.vehicle_types[1].default_reserve_time
        json.data.vehicle_types[1].default_pricing_plan_id = id_not_requiring
        json.data.vehicle_types[1].pricing_plan_ids = [id_not_requiring]

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

    expect.assertions(3)

    return gbfs.validation().then((result) => {
      let { errors, nonSchemaErrors, warnings } = get_errors(result)

      expect(errors).toEqual([])
      expect(warnings).toEqual([])
      expect(nonSchemaErrors).toEqual([
        {
          errors: [
            {
              key: 'default_reserve_time',
              message: 'Missing default_reserve_time.',
              path: '/data/vehicle_types/0'
            }
          ],
          file: 'vehicle_types.json',
          lang: undefined
        }
      ])
    })
  })
})
