const got = require('got')
const validate = require('./validate')

function hasErrors(data, required) {
  let hasError = false

  data.forEach(el => {
    if (Array.isArray(el)) {
      if (hasErrors(el, required)) {
        hasError = true
      }
    } else {
      if (required && !el.exists ? true : !!el.errors || el.hasErrors) {
        hasError = true
      }
    }
  })

  return hasError
}

function countErrors(file) {
  let count = 0

  if (file.hasErrors) {
    if (file.errors) {
      count = file.errors.length
    } else if (file.languages) {
      if (file.required) {
        count += file.languages.filter(l => !l.exists).length
      }

      count += file.languages.reduce((acc, l) => {
        if (l.exists) {
          acc += l.errors.length
        }

        return acc
      }, 0)
    }
  }

  return count
}

function getPartialSchema(version, partial, data = {}) {
  let partialSchema

  try {
    partialSchema = require(`./versions/partials/v${version}/${partial}.js`)(
      data
    )
  } catch (error) {
    return null
  }

  return partialSchema
}

function getVehicleTypes({ body }) {
  if (Array.isArray(body)) {
    return body.reduce((acc, lang) => {
      lang.body?.data?.vehicle_types.map(vt => {
        if (!acc.find(f => f.vehicle_type_id === vt.vehicle_type_id)) {
          acc.push({
            vehicle_type_id: vt.vehicle_type_id,
            form_factor: vt.form_factor,
            propulsion_type: vt.propulsion_type
          })
        }
      })

      return acc
    }, [])
  } else {
    return body?.data?.vehicle_types.map(vt => ({
      vehicle_type_id: vt.vehicle_type_id,
      form_factor: vt.form_factor,
      propulsion_type: vt.propulsion_type
    }))
  }
}

function getPricingPlans({ body }) {
  if (Array.isArray(body)) {
    return body.reduce((acc, lang) => {
      lang.body?.data?.plans.map(pp => {
        if (!acc.find(f => f.plan_id === pp.plan_id)) {
          acc.push(pp)
        }
      })

      return acc
    }, [])
  } else {
    return body?.data?.plans
  }
}

function hadVehiclesId({ body }) {
  if (Array.isArray(body)) {
    return body.some(lang => lang.body.data.bikes.find(b => b.vehicle_type_id))
  } else {
    return body.data.bikes.some(b => b.vehicle_type_id)
  }
}

function hasStationId({ body }) {
  if (Array.isArray(body)) {
    return body.some(lang => lang.body.data.bikes.find(b => b.station_id))
  } else {
    return body.data.bikes.some(b => b.station_id)
  }
}

function hasPricingPlanId({ body }) {
  if (Array.isArray(body)) {
    return body.some(lang => lang.body.data.bikes.find(b => b.pricing_plan_id))
  } else {
    return body.data.bikes.some(b => b.pricing_plan_id)
  }
}

function hasRentalUris({ body }, key, store) {
  if (Array.isArray(body)) {
    return body.some(lang =>
      lang.body.data[key].find(b => b.rental_uris?.[store])
    )
  } else {
    return body.data[key].some(b => b.rental_uris?.[store])
  }
}

function fileExist(file) {
  if (!file) {
    return false
  }

  if (file.exists) {
    return true
  } else if (Array.isArray(file.body)) {
    return file.body.some(lang => lang.exists)
  }

  return false
}

function isGBFSFileRequire(version) {
  if (!version) {
    return false
  } else {
    return require(`./versions/v${version}`).gbfsRequired
  }
}

class GBFS {
  constructor(
    url,
    { docked = false, freefloating = false, version = null, auth = {} } = {}
  ) {
    if (!url) {
      throw new Error('Missing URL')
    }

    this.url = url
    this.options = {
      docked,
      freefloating,
      version
    }
    this.auth = auth

    this.gotOptions = {}

    if (this.auth && this.auth.type) {
      if (this.auth.type === 'basic_auth' && this.auth.basicAuth) {
        this.gotOptions.headers = {
          Authorization: `basic ${Buffer.from(
            `${this.auth.basicAuth.user}:${this.auth.basicAuth.password}`,
            'utf-8'
          ).toString('base64')}`
        }
      }

      if (this.auth.type === 'bearer_token' && this.auth.bearerToken) {
        this.gotOptions.headers = {
          Authorization: `Bearer ${this.auth.bearerToken.token}`
        }
      }
    }
  }

  alternativeAutoDiscovery(url) {
    return got
      .get(url, this.gotOptions)
      .json()
      .then(body => {
        if (typeof body !== 'object') {
          return {
            recommanded: true,
            required: isGBFSFileRequire(this.options.version),
            errors: false,
            exists: false,
            file: `gbfs.json`,
            hasErrors: false,
            url: null
          }
        }

        this.autoDiscovery = body
        const { errors, schema } = this.validateFile(
          this.options.version || body.version || '1.0',
          'gbfs',
          this.autoDiscovery
        )

        return {
          schema,
          errors,
          url,
          version: body.version,
          recommanded: true,
          required: isGBFSFileRequire(
            this.options.version || body.version || '1.0'
          ),
          exists: true,
          file: `gbfs.json`,
          hasErrors: !!errors
        }
      })
      .catch(() => {
        return {
          url,
          recommanded: true,
          required: isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  checkAutodiscovery() {
    return got
      .get(this.url, this.gotOptions)
      .json()
      .then(body => {
        if (typeof body !== 'object') {
          return this.alternativeAutoDiscovery(
            new URL('gbfs.json', this.url).toString()
          )
        }

        this.autoDiscovery = body

        const { errors, schema } = this.validateFile(
          this.options.version || body.version || '1.0',
          'gbfs',
          this.autoDiscovery
        )

        return {
          schema,
          errors,
          url: this.url,
          version: body.version || '1.0',
          recommanded: true,
          required: isGBFSFileRequire(
            this.options.version || body.version || '1.0'
          ),
          exists: true,
          file: `gbfs.json`,
          hasErrors: !!errors
        }
      })
      .catch(e => {
        if (!this.url.match(/gbfs.json$/)) {
          return this.alternativeAutoDiscovery(
            new URL('gbfs.json', this.url).toString()
          )
        }

        return {
          url: this.url,
          recommanded: true,
          required: isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  validateFile(version, file, data, options) {
    let schema

    try {
      schema = require(`./versions/schemas/v${version}/${file}`)
    } catch (e) {
      console.log(e)
      throw new Error('can not require')
    }

    return validate(schema, data, options)
  }

  getFile(type, required) {
    if (this.autoDiscovery) {
      const urls = Object.entries(this.autoDiscovery.data).map(key => {
        return Object.assign(
          { lang: key[0] },
          this.autoDiscovery.data[key[0]].feeds.find(f => f.name === type)
        )
      })

      return Promise.all(
        urls.map(
          lang =>
            lang && lang.url
              ? got
                  .get(lang.url, this.gotOptions)
                  .json()
                  .then(body => {
                    return {
                      body,
                      exists: true,
                      lang: lang.lang,
                      url: lang.url
                    }
                  })
                  .catch(() => ({
                    body: null,
                    exists: false,
                    lang: lang.lang,
                    url: lang.url
                  }))
              : {
                  body: null,
                  exists: false,
                  lang: lang.lang,
                  url: null
                }
        )
      ).then(bodies => {
        return {
          body: bodies,
          required,
          type
        }
      })
    } else {
      return got
        .get(`${this.url}/${type}.json`, this.gotOptions)
        .json()
        .then(body => ({
          body,
          required,
          exists: true,
          type
        }))
        .catch(err => ({
          body: null,
          required,
          errors: required ? err : null,
          exists: false,
          type
        }))
    }
  }

  validationFile(body, version, type, required, options) {
    if (Array.isArray(body)) {
      body = body.filter(b => b.exists || b.required).map(b => ({
        ...b,
        ...this.validateFile(version, type, b.body, options)
      }))

      return {
        languages: body,
        required,
        exists: body.length
          ? body.reduce((acc, l) => acc && l.exists, true)
          : false,
        file: `${type}.json`,
        hasErrors: hasErrors(body, required)
      }
    } else {
      return {
        required,
        ...this.validateFile(version, type, body, options),

        exists: !!body,
        file: `${type}.json`,
        url: `${this.url}/${type}.json`
      }
    }
  }

  getToken() {
    return got
      .post(this.auth.oauthClientCredentialsGrant.tokenUrl, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        username: this.auth.oauthClientCredentialsGrant.user,
        password: this.auth.oauthClientCredentialsGrant.password,
        body: 'grant_type=client_credentials'
      })
      .json()
      .then(auth => {
        this.gotOptions.headers = {
          Authorization: `Bearer ${auth.access_token}`
        }
      })
  }

  async validation() {
    if (this.auth && this.auth.type === 'oauth_client_credentials_grant') {
      await this.getToken()
    }

    const gbfsResult = await this.checkAutodiscovery()

    if (!gbfsResult.version) {
      return {
        summary: {
          versionUnimplemented: true
        }
      }
    }

    const gbfsVersion = this.options.version || gbfsResult.version

    let files = require(`./versions/v${gbfsVersion}.js`).files(this.options)

    const t = await Promise.all(
      files.map(f => this.getFile(f.file, f.required))
    )

    const vehicleTypesFile = t.find(a => a.type === 'vehicle_types')
    const freeBikeStatusFile = t.find(a => a.type === 'free_bike_status')
    const stationInformationFile = t.find(a => a.type === 'station_information')
    const stationPricingPlans = t.find(a => a.type === 'system_pricing_plans')

    let vehicleTypes,
      pricingPlans,
      freeBikeStatusHasVehicleId,
      hasIosRentalUris,
      hasAndroidRentalUris,
      hasBikesStationId,
      hasBikesPricingPlanId

    const result = [gbfsResult]

    if (fileExist(vehicleTypesFile)) {
      vehicleTypes = getVehicleTypes(vehicleTypesFile)
    }

    if (fileExist(freeBikeStatusFile)) {
      freeBikeStatusHasVehicleId = hadVehiclesId(freeBikeStatusFile)
      hasIosRentalUris = hasRentalUris(freeBikeStatusFile, 'bikes', 'ios')
      hasAndroidRentalUris = hasRentalUris(
        freeBikeStatusFile,
        'bikes',
        'android'
      )
      hasBikesStationId = hasStationId(freeBikeStatusFile)
      hasBikesPricingPlanId = hasPricingPlanId(freeBikeStatusFile)
    }

    if (fileExist(stationInformationFile)) {
      hasIosRentalUris =
        hasIosRentalUris ||
        hasRentalUris(stationInformationFile, 'stations', 'ios')
      hasAndroidRentalUris =
        hasAndroidRentalUris ||
        hasRentalUris(stationInformationFile, 'stations', 'android')
    }

    if (fileExist(stationPricingPlans)) {
      pricingPlans = getPricingPlans(stationPricingPlans)
    }

    t.forEach(f => {
      const addSchema = []
      let required = f.required

      switch (f.type) {
        case 'station_status':
          if (vehicleTypes && vehicleTypes.length) {
            const partial = getPartialSchema(
              gbfsVersion,
              'required_vehicle_types_available',
              {
                vehicleTypes
              }
            )
            if (partial) {
              addSchema.push(partial)
            }
          }
          break
        case 'free_bike_status':
          if (vehicleTypes && vehicleTypes.length) {
            const partial = getPartialSchema(
              gbfsVersion,
              'required_vehicle_type_id',
              {
                vehicleTypes
              }
            )
            if (partial) {
              addSchema.push(partial)
            }
          }
          break
        case 'vehicle_types':
          if (freeBikeStatusHasVehicleId || hasBikesStationId) {
            required = true
          }
          if (pricingPlans && pricingPlans.length) {
            const partial = getPartialSchema(gbfsVersion, 'pricing_plan_id', {
              pricingPlans
            })

            if (partial) {
              addSchema.push(partial)
            }
          }

          break
        case 'system_pricing_plans':
          if (hasBikesPricingPlanId) {
            required = true
          }
          break
        case 'system_information':
          if (hasAndroidRentalUris || hasIosRentalUris) {
            const partial = getPartialSchema(
              gbfsVersion,
              'required_store_uri',
              {
                ios: hasIosRentalUris,
                android: hasAndroidRentalUris
              }
            )
            if (partial) {
              addSchema.push(partial)
            }
          }
        default:
          break
      }

      result.push(
        this.validationFile(f.body, gbfsVersion, f.type, required, {
          addSchema
        })
      )
    })

    const filesResult = result.map(file => ({
      ...file,
      errorsCount: countErrors(file)
    }))

    return {
      summary: {
        version: {
          detected: result[0].version,
          validated: this.options.version || result[0].version
        },
        hasErrors: hasErrors(result),
        errorsCount: filesResult.reduce((acc, file) => {
          acc += file.errorsCount
          return acc
        }, 0)
      },
      files: filesResult
    }
  }
}

module.exports = GBFS
