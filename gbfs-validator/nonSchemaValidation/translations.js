const { getFileBody } = require('./utils')

const TRANSLATED_FIELDS = {
  system_information: [
    ['name'],
    ['short_name'],
    ['operator'],
    ['attribution_organization_name'],
    ['terms_url'],
    ['privacy_url']
  ],
  vehicle_types: [
    ['vehicle_types', 'name'],
    ['vehicle_types', 'make'],
    ['vehicle_types', 'model'],
    ['vehicle_types', 'description']
  ],
  station_information: [
    ['stations', 'name'],
    ['stations', 'short_name']
  ],
  system_regions: [['regions', 'name']],
  system_pricing_plans: [
    ['plans', 'name'],
    ['plans', 'description']
  ],
  system_alerts: [
    ['alerts', 'url'],
    ['alerts', 'summary'],
    ['alerts', 'description']
  ],
  geofencing_zones: [['geofencing_zones', 'features', 'properties', 'name']]
}

function checkTranslations(errors, data, languages, path, prefix = []) {
  if (!data) {
    return
  }

  if (path.length) {
    if (Array.isArray(data)) {
      for (const value of data) {
        checkTranslations(errors, value, languages, path, prefix)
      }
      return
    }

    if (typeof data !== 'object') {
      return
    }

    path = [...path]
    let currentPath = path.shift()

    checkTranslations(errors, data[currentPath], languages, path, [
      ...prefix,
      currentPath
    ])
    return
  }

  if (!Array.isArray(data)) {
    return
  }

  for (const lang of languages) {
    const filtered = data.filter((a) => a.language === lang)
    if (filtered.length === 0) {
      errors.push({
        path: `/${prefix.join('/')}`,
        key: 'missing_translation',
        message: `Missing translation for ${lang}.`
      })

      continue
    }

    data = data.filter((a) => a.language !== lang)
  }

  for (const value of data) {
    errors.push({
      path: `/${prefix.join('/')}`,
      key: 'unknown_language',
      message: `Unknown language ${value.language}.`
    })
  }
}

function checkTranslatedStrings({ errors, file, data, lang, allFiles }) {
  const translations = TRANSLATED_FIELDS[file] || []

  const languages =
    getFileBody(allFiles, 'system_information', lang)?.data?.languages || []

  for (const path of translations) {
    checkTranslations(errors, data.data, languages, path)
  }
}

module.exports = {
  checkTranslatedStrings
}
