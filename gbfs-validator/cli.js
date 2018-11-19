const { inspect } = require('util')
const GBFS = require('./')

if (!process.argv[2]) {
  console.error('Usage: gbfs-validator GBFS_URL')
  process.exit(1)
}

const gbfs = new GBFS(process.argv[2])

gbfs
  .validation()
  .then(result => console.log(inspect(result, { depth: null, colors: true })))
