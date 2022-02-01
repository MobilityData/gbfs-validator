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
    partialSchema = require(`./schema/v${version}/partials/${partial}.js`)(data)
  } catch (error) {
    throw new Error(`Partial schema '${partial}' not found for 'v${version}'`)
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

function hadVehiclesId({ body }) {
  if (Array.isArray(body)) {
    body.forEach(lang => {
      if (lang.body.data.bikes.find(b => b.vehicle_type_id)) {
        return true
      }
    })
  } else {
    return !!body.data.bikes.find(b => b.vehicle_type_id)
  }
}

function fileExist(file) {
  if (file.exists) {
    return true
  } else if (Array.isArray(file.body)) {
    file.body.forEach(lang => {
      if (lang.exists) {
        return true
      }
    })
  }

  return false
}

function isGBFSFileRequire(version) {
  if (!version) {
    return false
  } else {
    return require(`./schema/v${version}`).gbfsRequired
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
        const errors = this.validateFile(
          this.options.version || body.version || '1.0',
          'gbfs',
          this.autoDiscovery
        )

        return {
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

        const errors = this.validateFile(
          this.options.version || body.version || '1.0',
          'gbfs',
          this.autoDiscovery
        )

        return {
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
        errors: this.validateFile(version, type, b.body, options)
      }))

      return {
        languages: body,
        required,
        exists: body.reduce((acc, l) => acc && l.exists, true),
        file: `${type}.json`,
        hasErrors: hasErrors(body, required)
      }
    } else {
      return {
        required,
        errors: this.validateFile(version, type, body, options),
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

    let files = require(`./versions/v${this.options.version ||
      gbfsResult.version}.js`).files(this.options)

    const t = await Promise.all(
      files.map(f => this.getFile(f.file, f.required))
    )

    const vehicleTypesFile = t.find(a => a.type === 'vehicle_types')
    const freeBikeStatusFile = t.find(a => a.type === 'free_bike_status')
    let vehicleTypes, freeBikeStatusHasVehicleId

    const result = [gbfsResult]

    if (fileExist(vehicleTypesFile)) {
      vehicleTypes = getVehicleTypes(vehicleTypesFile)
    }

    if (fileExist(freeBikeStatusFile)) {
      freeBikeStatusHasVehicleId = hadVehiclesId(freeBikeStatusFile)
    }

    t.forEach(f => {
      switch (f.type) {
        case 'free_bike_status':
          result.push(
            this.validationFile(
              f.body,
              this.options.version || gbfsResult.version,
              f.type,
              f.required,
              {
                addSchema:
                  vehicleTypes && vehicleTypes.length
                    ? getPartialSchema(
                        this.options.version || gbfsResult.version,
                        'required_vehicle_type_id',
                        { vehicleTypes }
                      )
                    : getPartialSchema(
                        this.options.version || gbfsResult.version,
                        'no_required_vehicle_type_id'
                      )
              }
            )
          )
          break

        case 'vehicle_types':
          result.push(
            this.validationFile(
              f.body,
              this.options.version || gbfsResult.version,
              f.type,
              freeBikeStatusHasVehicleId || f.required
            )
          )
          break

        default:
          result.push(
            this.validationFile(
              f.body,
              this.options.version || gbfsResult.version,
              f.type,
              f.required
            )
          )
          break
      }
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
