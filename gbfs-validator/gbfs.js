const axios = require('axios')

const validators = {
  gbfs: require('./validation/gbfs'),
  system_information: require('./validation/systemInformation'),
  station_information: require('./validation/stationInformation'),
  station_status: require('./validation/stationStatus'),
  free_bike_status: require('./validation/freeBikeStatus'),
  system_hours: require('./validation/systemHours'),
  system_calendar: require('./validation/systemCalendar'),
  system_regions: require('./validation/systemRegions'),
  system_pricing_plans: require('./validation/systemPricingPlans'),
  system_alerts: require('./validation/systemAlerts')
}

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
  constructor(url, { docked = false, freefloating = false } = {}) {
    this.url = url
    this.options = {
      docked,
      freefloating
    }
  }

  alternativeAutoDiscovery(url) {
    return axios(url, { json: true })
      .then(({ data }) => {
        if (typeof data !== 'object') {
          return {
            recommanded: true,
            required: false,
            errors: false,
            exists: false,
            file: `gbfs.json`,
            hasErrors: false,
            url: null
          }
        }

        this.autoDiscovery = data
        const errors = validators.gbfs(this.autoDiscovery)

        return {
          errors,
          url,
          recommanded: true,
          required: false,
          exists: true,
          file: `gbfs.json`,
          hasErrors: !!errors
        }
      })
      .catch(() => {
        return {
          url,
          recommanded: true,
          required: false,
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
          return this.alternativeAutoDiscovery(`${this.url}/gbfs.json`)
        }

        this.autoDiscovery = data
        const errors = validators.gbfs(this.autoDiscovery)
        return {
          errors,
          url: this.url,
          recommanded: true,
          required: false,
          exists: true,
          file: `gbfs.json`,
          hasErrors: !!errors
        }
      })
      .catch(() => {
        if (!this.url.match(/gbfs.json$/)) {
          return this.alternativeAutoDiscovery(`${this.url}/gbfs.json`)
        }

        return {
          url: this.url,
          recommanded: true,
          required: false,
          errors: false,
          exists: false,
          file: `gbfs.json`,
          hasErrors: false
        }
      })
  }

  checkFile(type, required) {
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
                  errors: validators[type](data),
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
          errors: validators[type](data),
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
    const gbfsResult = await this.checkAutodiscovery()
    return Promise.all([
      Promise.resolve(gbfsResult),
      this.checkFile('system_information', true),
      this.checkFile('station_information', this.options.docked),
      this.checkFile('station_status', this.options.docked),
      this.checkFile('free_bike_status', this.options.freefloating),
      this.checkFile('system_hours', false),
      this.checkFile('system_calendar', false),
      this.checkFile('system_regions', false),
      this.checkFile('system_pricing_plans', false),
      this.checkFile('system_alerts', false)
    ]).then(result => {
      return {
        summary: {
          hasErrors: hasErrors(result)
        },
        files: result
      }
    })
  }
}

module.exports = GBFS
