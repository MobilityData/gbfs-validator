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

class GBFS {
  constructor(
    url,
    { docked = false, freefloating = false, version = null, auth = {} } = {}
  ) {
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
            required: this.isGBFSFileRequire(this.options.version),
            errors: false,
            exists: false,
            file: `gbfs.json`,
            hasErrors: false,
            url: null
          }
        }

        this.autoDiscovery = body
        const errors = this.validateFile(
          this.options.version || body.version,
          'gbfs',
          this.autoDiscovery
        )

        return {
          errors,
          url,
          version: body.version,
          recommanded: true,
          required: this.isGBFSFileRequire(
            this.options.version || body.version
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
          this.options.version || body.version,
          'gbfs',
          this.autoDiscovery
        )

        return {
          errors,
          url: this.url,
          version: body.version,
          recommanded: true,
          required: this.isGBFSFileRequire(
            this.options.version || body.version
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
              ? got
                  .get(lang.url, this.gotOptions)
                  .json()
                  .then(body => ({
                    errors: this.validateFile(version, type, body),
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
      return got
        .get(`${this.url}/${type}.json`, this.gotOptions)
        .json()
        .then(body => ({
          required,
          errors: this.validateFile(version, type, body),
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
      const files = result.map(file => ({
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
          errorsCount: files.reduce((acc, file) => {
            acc += file.errorsCount
            return acc
          }, 0)
        },
        files
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
