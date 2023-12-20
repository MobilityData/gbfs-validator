const fs = require('fs')
const path = require('path')
const gbfsValidator = require('gbfs-validator')
const parse = require('csv-parse')

if (!process.argv[2]) {
  console.error('Usage: check-systems FILE')
  process.exit(1)
}

/**
 * This function reads the local version of the file systems.csv (must be downloaded manually first),
 * validates every system in the file and writes the validation report locally.
 * @param {*} line - A row in the file systems.csv.
 * @returns 
 */
function checkGBFS(line) {
  const gbfs = new gbfsValidator(line[5])

  return gbfs
    .validation()
    .then(result => {
      if (result.summary.versionUnimplemented) {
        console.log(`${line[3]} PASS (Version not implemented)`)
      } else {
        if (result.summary.hasErrors) {
          console.log(`${line[3]} KO (${result.summary.errorsCount} errors)`)
          fs.writeFileSync(`out-${line[3]}.log`, JSON.stringify(result, ' ', 2))
        } else {
          console.log(`${line[3]} OK`)
        }
      }
    })
    .catch(err => {
      console.log(line[3], 'ERROR', err.message)
    })
}

fs.readFile(path.resolve(__dirname, process.argv[2]), (err, file) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  parse(file, function(err, output) {
    Promise.all(output.slice(1).map(checkGBFS))
  })
})
