const got = require('got')
const validate = require('./validate')
const validatorVersion = process.env.COMMIT_REF
  ? process.env.COMMIT_REF.substring(0, 7)
  : require('./package.json').version

/**
 * @typedef {{
 *            languages: Object,
 *            file: string,
 *            url: string,
 *            required: boolean,
 *            recommended: boolean,
 *            exists: boolean,
 *            hasErrors: boolean,
 *            errors: Object,
 *            schema: Object,
 *            version: string
 *          }} FileValidationResult
 */

/**
 * @typedef {{
*            vehicle_type_id: string,
*            form_factor: string,
*            propulsion_type: string
*          }} VehicleType
*/

  /**
 * This function returns true if the file from a GBFS feed has errors or if the file is required and missing.
 * @param {Object} data - The body of a file from a GBFS feed.
 * @param {boolean} required - True if the file is required.
 * @returns {boolean}
 */
function hasErrors(data, required) {
  let hasError = false

  data.forEach((el) => {
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

/**
 * This function returns the number of errors in a file of a GBFS feed.
 * @param {FileValidationResult} file - The validation result of a file from a GBFS feed.
 * @returns {number}
 */
function countErrors(file) {
  let count = 0

  if (file.hasErrors) {
    if (file.errors) {
      count = file.errors.length
    } else if (file.languages) {
      if (file.required) {
        count += file.languages.filter((l) => !l.exists).length
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

/**
 * This function returns a JSON Patch to modify a GBFS JSON schema.
 * @param {string} version - The version of the GBFS feed.
 * @param {string} partial - The path to the JSON Patch file.
 * @param {Object} data - The params for generating the JSON Patch.
 * @returns {Object} - A JSON Patch.
 */
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

/**
 * This function returns an array of vehicle types defined in vehicle_types.json.
 * @param {Object} param0 - The vehicle_types.json file.
 * @returns {VehicleType[]}
 */
function getVehicleTypes({ body }) {
  if (Array.isArray(body)) {
    return body.reduce((acc, lang) => {
      lang.body?.data?.vehicle_types.map((vt) => {
        if (!acc.find((f) => f.vehicle_type_id === vt.vehicle_type_id)) {
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
    return body?.data?.vehicle_types.map((vt) => ({
      vehicle_type_id: vt.vehicle_type_id,
      form_factor: vt.form_factor,
      propulsion_type: vt.propulsion_type
    }))
  }
}

/**
 * This function returns an array of pricing plans defined in system_pricing_plans.json.
 * @param {*} param0 - The system_pricing_plans.json file.
 * @returns {Object[]} - An array of pricing plans.
 */
function getPricingPlans({ body }) {
  if (Array.isArray(body)) {
    return body.reduce((acc, lang) => {
      lang.body?.data?.plans.map((pp) => {
        if (!acc.find((f) => f.plan_id === pp.plan_id)) {
          acc.push(pp)
        }
      })

      return acc
    }, [])
  } else {
    return body?.data?.plans
  }
}

/**
 * This function returns true if free_bike_status.json contains a vehicle with a vehicle_type_id.
 * @param {*} param0 - The free_bike_status.json file.
 * @returns {boolean}
 */
function hadVehicleTypeId({ body }) {
  if (Array.isArray(body)) {
    return body.some((lang) =>
      lang.body.data.bikes.find((b) => b.vehicle_type_id)
    )
  } else {
    return body.data.bikes.some((b) => b.vehicle_type_id)
  }
}

/**
 * This function returns true if free_bike_status.json contains a vehicle with a pricing_plan_id.
 * @param {*} param0 - The free_bike_status.json file.
 * @returns {boolean}
 */
function hasPricingPlanId({ body }) {
  if (Array.isArray(body)) {
    return body.some((lang) =>
      lang.body.data.bikes.find((b) => b.pricing_plan_id)
    )
  } else {
    return body.data.bikes.some((b) => b.pricing_plan_id)
  }
}

/**
 * This function returns true if a file from a GBFS feed contains a specific rental_uri (ios or android).
 * @param {Object} param0 - A file from a GBFS feed.
 * @param {string} key - The type of the objects that may contain a rental_uri (bikes or stations).
 * @param {string} store - The type of store (ios or android).
 * @returns {boolean}
 */
function hasRentalUris({ body }, key, store) {
  if (Array.isArray(body)) {
    return body.some((lang) =>
      lang.body.data[key].find((b) => b.rental_uris?.[store])
    )
  } else {
    return body.data[key].some((b) => b.rental_uris?.[store])
  }
}

/**
 * This function returns true if a file from a GBFS feed exists in any language.
 * @param {Object} file - A file from a GBFS feed.
 * @returns {boolean}
 */
function fileExist(file) {
  if (!file) {
    return false
  }

  if (file.exists) {
    return true
  } else if (Array.isArray(file.body)) {
    return file.body.some((lang) => lang.exists)
  }

  return false
}

/**
 * This function returns true if the gbfs.json file is required.
 * @param {string} version - The version of the GBFS feed.
 * @returns {boolean}
 */
function isGBFSFileRequire(version) {
  if (!version) {
    return false
  } else {
    return require(`./versions/v${version}`).gbfsRequired
  }
}

/** Class representing a GBFS feed. */
class GBFS {
  /**
   * Creates a GBFS feed.
   * @param {string} url - The URL of the gbfs.json file.
   * @param {Object} param1 - The parameters of the validation.
   */
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

      if (this.auth.type === 'headers') {
        this.gotOptions.headers = {}
        for (var header of this.auth.headers) {
          if (header && header.value) {
            this.gotOptions.headers[header.key] = header.value
          }
        }
      }
    }
  }

  /**
   * This function returns the FileValidationResult of the gbfs.json file from a generated URL.
   * @param {string} url - The URL of the gbfs.json file.
   * @returns FileValidationResult
   */
  alternativeAutoDiscovery(url) {
    return got
      .get(url, this.gotOptions)
      .json()
      .then((body) => {
        if (typeof body !== 'object') {
          return {
            recommended: true,
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
          recommended: true,
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
          recommended: true,
          required: isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  /**
   * This function returns the FileValidationResult of the gbfs.json file.
   * @returns FileValidationResult
   */
  checkAutodiscovery() {
    return got
      .get(this.url, this.gotOptions)
      .json()
      .then((body) => {
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
          recommended: true,
          required: isGBFSFileRequire(
            this.options.version || body.version || '1.0'
          ),
          exists: true,
          file: `gbfs.json`,
          hasErrors: !!errors
        }
      })
      .catch((e) => {
        if (!this.url.match(/gbfs.json$/)) {
          return this.alternativeAutoDiscovery(
            new URL('gbfs.json', this.url).toString()
          )
        }

        return {
          url: this.url,
          recommended: true,
          required: isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  /**
   * This function retrieves the JSON schema and returns the result of the validate function.
   * @param {string} version - The version of the GBFS feed.
   * @param {string} file - The type of file from a GBFS feed.
   * @param {Object} data - The body of a file from a GBFS feed.
   * @param {Object} options - An Object that contains an array of JSON Patches.
   * @returns {Object}
   */
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

  /**
   * This function returns on Object which contains the body of a file from a GBFS feed.
   * @param {string} type - The type of file from a GBFS feed.
   * @param {boolean} required - True if the file is required.
   * @returns {Object}
   */
  getFile(type, required) {
    if (this.autoDiscovery) {
      let urls

      let version = this.options.version || this.autoDiscovery.version

      // 3.0-RC , 3.0 and upcoming minor versions
      if (/^3\.\d/.test(version)) {
        urls =
          this.autoDiscovery.data.feeds?.filter((f) => f.name === type) || []
      } else {
        urls = Object.entries(this.autoDiscovery.data).map((key) => {
          return Object.assign(
            { lang: key[0] },
            this.autoDiscovery.data[key[0]].feeds.find((f) => f.name === type)
          )
        })
      }

      return Promise.all(
        urls.map((lang) =>
          lang && lang.url
            ? got
                .get(lang.url, this.gotOptions)
                .json()
                .then((body) => {
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
      ).then((bodies) => {
        return {
          file: `${type}.json`,
          body: bodies,
          required,
          type
        }
      })
    } else {
      return got
        .get(`${this.url}/${type}.json`, this.gotOptions)
        .json()
        .then((body) => ({
          file: `${type}.json`,
          body,
          required,
          exists: true,
          type
        }))
        .catch((err) => ({
          file: `${type}.json`,
          body: null,
          required,
          errors: required ? err : null,
          exists: false,
          type
        }))
    }
  }

  /**
   * This function returns the FileValidationResult of a file from a GBFS feed.
   * @param {Object} body - The body of a file from a GBFS feed.
   * @param {string} version - The version of the GBFS feed.
   * @param {string} type - The type of file from a GBFS feed.
   * @param {boolean} required - True if the file is required.
   * @param {Object} options - An Object that contains an array of JSON Patches.
   * @returns FileValidationResult
   */
  validationFile(body, version, type, required, options) {
    if (Array.isArray(body)) {
      body = body
        .filter((b) => b.exists || b.required)
        .map((b) => ({
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

  /**
   * This function returns a token to access a GBFS feed.
   * @returns {Object}
   */
  getToken() {
    return got
      .post(this.auth.oauthClientCredentialsGrant.tokenUrl, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        username: this.auth.oauthClientCredentialsGrant.user,
        password: this.auth.oauthClientCredentialsGrant.password,
        body: 'grant_type=client_credentials'
      })
      .json()
      .then((auth) => {
        this.gotOptions.headers = {
          Authorization: `Bearer ${auth.access_token}`
        }
      })
  }

  /**
   * This function returns an Object that contains all the files from a GBFS feed and the FileValidationResult of the gbfs.json file.
   * @returns {Object}
   */
  async getFiles() {
    if (this.auth && this.auth.type === 'oauth_client_credentials_grant') {
      await this.getToken()
    }

    const gbfsResult = await this.checkAutodiscovery()

    if (!gbfsResult.version) {
      return {
        summary: {
          gbfsResult,
          gbfsVersion: gbfsResult.version,
          validatorVersion,
          versionUnimplemented: true
        }
      }
    }

    const gbfsVersion = this.options.version || gbfsResult.version

    let filesRequired = require(`./versions/v${gbfsVersion}.js`).files(
      this.options
    )

    return {
      summary: {},
      gbfsResult,
      gbfsVersion,
      files: await Promise.all(
        filesRequired.map((f) => this.getFile(f.file, f.required))
      )
    }
  }

  /**
   * This function returns an Object that contains the FileValidationResult of all the files from a GBFS feed.
   * @returns {Object}
   */
  async validation() {
    const { gbfsResult, gbfsVersion, files, summary } = await this.getFiles()

    if (summary?.versionUnimplemented) {
      return { summary }
    }

    const vehicleTypesFile = files.find((a) => a.type === 'vehicle_types')
    const freeBikeStatusFile = files.find((a) => a.type === 'free_bike_status')
    const stationInformationFile = files.find(
      (a) => a.type === 'station_information'
    )
    const systemPricingPlans = files.find(
      (a) => a.type === 'system_pricing_plans'
    )
    const systemInformation = files.find((a) => a.type === 'system_information')

    const manifestUrl = systemInformation?.body?.[0]?.body?.data?.manifest_url

    if (manifestUrl) {
      try {
        const body = await got.get(manifestUrl, this.gotOptions).json()

        files.push({
          body: [
            {
              body,
              exists: true,
              url: manifestUrl
            }
          ],
          required: true,
          type: 'manifest'
        })
      } catch (error) {
        files.push({
          url: manifestUrl,
          recommended: true,
          required: true,
          errors: false,
          exists: false,
          file: `manifest.json`,
          type: 'manifest',
          hasErrors: false
        })
      }
    }

    let vehicleTypes,
      pricingPlans,
      freeBikeStatusHasVehicleTypeId,
      hasIosRentalUris,
      hasAndroidRentalUris,
      hasBikesPricingPlanId

    const result = [gbfsResult]

    if (fileExist(vehicleTypesFile)) {
      vehicleTypes = getVehicleTypes(vehicleTypesFile)
    }

    if (fileExist(freeBikeStatusFile)) {
      freeBikeStatusHasVehicleTypeId = hadVehicleTypeId(freeBikeStatusFile)
      hasIosRentalUris = hasRentalUris(freeBikeStatusFile, 'bikes', 'ios')
      hasAndroidRentalUris = hasRentalUris(
        freeBikeStatusFile,
        'bikes',
        'android'
      )
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

    if (fileExist(systemPricingPlans)) {
      pricingPlans = getPricingPlans(systemPricingPlans)
    }

    files.forEach((f) => {
      const addSchema = []
      let required = f.required

      switch (f.type) {
        case 'station_status':
          if (vehicleTypes && vehicleTypes.length) {
            const partial = getPartialSchema(
              gbfsVersion,
              'station_status/required_vehicle_types_available',
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
              'free_bike_status/required_vehicle_type_id',
              {
                vehicleTypes
              }
            )
            if (partial) {
              addSchema.push(partial)
            }
          }
          break
        case 'vehicle_status':
          if (vehicleTypes && vehicleTypes.length) {
            const partial = getPartialSchema(
              gbfsVersion,
              'vehicle_status/required_vehicle_type_id',
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
          if (freeBikeStatusHasVehicleTypeId) {
            required = true
          }
          if (pricingPlans && pricingPlans.length) {
            const partial = getPartialSchema(
              gbfsVersion,
              'vehicle_types/pricing_plan_id',
              {
                pricingPlans
              }
            )

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
              'system_information/required_store_uri',
              {
                ios: hasIosRentalUris,
                android: hasAndroidRentalUris
              }
            )
            if (partial) {
              addSchema.push(partial)
            }
          }
          break
        default:
          break
      }

      result.push(
        this.validationFile(f.body, gbfsVersion, f.type, required, {
          addSchema
        })
      )
    })

    const filesResult = result.map((file) => ({
      ...file,
      errorsCount: countErrors(file)
    }))

    return {
      summary: {
        validatorVersion,
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
