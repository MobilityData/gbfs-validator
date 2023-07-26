
function checkTTL({ errors, file, data }) {
    const realtime = [
      'free_bike_status',
      'station_status',
      'vehicle_status'
    ].includes(file)
  
    const now = Math.floor(new Date().getTime() / 1000)
    const fiveMinutesAgo = now - 5 * 60
  
    const last_updated = data.last_updated
  
    let allowed_skew_seconds = 10
    if (last_updated > now + allowed_skew_seconds) {
      errors.push({
        path: '/last_updated',
        key: 'last_updated_future',
        message: `Last update is in the future.`
      })
    }
  
    if (realtime && last_updated < fiveMinutesAgo) {
      errors.push({
        path: '/last_updated',
        key: 'last_updated_outdated',
        message: `Last update is older than 5 minutes.`
      })
    }
  }

  module.exports = { checkTTL }