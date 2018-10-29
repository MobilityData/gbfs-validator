const Gbfs = require('./index')

const gbfs = new Gbfs(
  'https://api.nextbike.net/maps/gbfs/v1/nextbike_ct/gbfs.json'
)

gbfs.validation().then(r => console.log(r))
