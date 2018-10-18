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

function snakeToCamel (s) {
  return s.replace(/(\_\w)/g, function (m) {
    return m[1].toUpperCase()
  })
}

function hasErrors (data, required) {
  let plop = false

  data.forEach(el => {
    if (Array.isArray(el)) {
      plop = hasErrors(el, required)
    } else {
      plop = required && !el.exists ? true : !!el.errors
    }
  })

  return plop
}

class GBFS {
  constructor (url) {
    this.url = url
  }

  alternativeAutoDiscovery (url) {
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

  checkAutodiscovery () {
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
      .catch(() => this.alternativeAutoDiscovery(`${this.url}/gbfs.json`))
  }

  checkFile (type, required) {
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
          file: `${type}.json`,
          hasErrors: hasErrors(languages, required)
        }
      })
    } else {
      return axios(`${this.url}/${type}.json`).then(({ data }) => ({
        required,
        errors: validators[type](data),
        exists: true,
        file: `${type}.json`,
        url: `${this.url}/${type}.json`
      }))
    }
  }

  async validation () {
    const gbfsResult = await this.checkAutodiscovery()

    return Promise.all([
      Promise.resolve(gbfsResult),
      this.checkFile('system_information', true),
      this.checkFile('station_information', false),
      this.checkFile('station_status', false),
      this.checkFile('free_bike_status', false),
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
