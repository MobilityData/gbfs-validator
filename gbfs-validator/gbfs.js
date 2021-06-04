const axios = require('axios')
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

class GBFS {
  constructor(
    url,
    { docked = false, freefloating = false, version = null } = {}
  ) {
    this.url = url
    this.options = {
      docked,
      freefloating,
      version
    }
  }

  alternativeAutoDiscovery(url) {
    return axios(url, { json: true })
      .then(({ data }) => {
        if (typeof data !== 'object') {
          return {
            recommanded: true,
            required: this.isGBFSFileRequire(this.options.version),
            errors: false,
            exists: false,
            file: `gbfs.json`,
            hasErrors: false,
            url: null
          }
        }

        this.autoDiscovery = data
        const errors = this.validateFile(
          this.options.version || data.version,
          'gbfs',
          this.autoDiscovery
        )

        return {
          errors,
          url,
          version: data.version,
          recommanded: true,
          required: this.isGBFSFileRequire(
            this.options.version || data.version
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
          required: this.isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  checkAutodiscovery() {
    return axios(this.url, { json: true })
      .then(({ status, data }) => {
        if (typeof data !== 'object') {
          return this.alternativeAutoDiscovery(
            new URL('gbfs.json', this.url).toString()
          )
        }

        this.autoDiscovery = data

        const errors = this.validateFile(
          this.options.version || data.version,
          'gbfs',
          this.autoDiscovery
        )

        return {
          errors,
          url: this.url,
          version: data.version,
          recommanded: true,
          required: this.isGBFSFileRequire(
            this.options.version || data.version
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
          required: this.isGBFSFileRequire(this.options.version),
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  validateFile(version, file, data) {
    let schema

    try {
      schema = require(`./schema/v${version}/${file}`)
    } catch (e) {
      throw new Error('can not require')
    }

    return validate(schema, data)
  }

  checkFile(version, type, required) {
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
              ? axios(lang.url).then(({ data }) => ({
                  errors: this.validateFile(version, type, data),
                  exists: true,
                  lang: lang.lang,
                  url: lang.url
                }))
              : {
                  errors: false,
                  exists: false,
                  lang: lang.lang,
                  url: null
                }
        )
      ).then(languages => {
        return {
          languages,
          required,
          exists: languages.reduce((acc, l) => acc && l.exists, true),
          file: `${type}.json`,
          hasErrors: hasErrors(languages, required)
        }
      })
    } else {
      return axios(`${this.url}/${type}.json`)
        .then(({ data }) => ({
          required,
          errors: this.validateFile(version, type, data),
          exists: true,
          file: `${type}.json`,
          url: `${this.url}/${type}.json`
        }))
        .catch(err => ({
          required,
          errors: required ? err : null,
          exists: false,
          file: `${type}.json`,
          url: `${this.url}/${type}.json`
        }))
    }
  }

  async validation() {
    if (!this.url) {
      throw new Error('Missing URL')
    }

    const gbfsResult = await this.checkAutodiscovery()

    if (!gbfsResult.version) {
      return {
        summary: {
          versionUnimplemented: true
        }
      }
    }

    let files = require(`./schema/v${this.options.version ||
      gbfsResult.version}`).files(this.options)

    return Promise.all([
      Promise.resolve(gbfsResult),
      ...files.map(f =>
        this.checkFile(
          this.options.version || gbfsResult.version,
          f.file,
          f.required
        )
      )
    ]).then(result => {
      return {
        summary: {
          version: {
            detected: result[0].version,
            validated: this.options.version || result[0].version
          },
          hasErrors: hasErrors(result)
        },
        files: result
      }
    })
  }

  isGBFSFileRequire(version) {
    if (!version) {
      return false
    } else {
      return require(`./schema/v${version}`).gbfsRequired
    }
  }
}

module.exports = GBFS
