const { inspect } = require('util')
const commander = require('commander')
const fs = require('fs')
const fsPath = require('path')
const GBFS = require('./')
const pjson = require('./package.json');

getFeedValidationReport = async (url) => {
  const gbfs = new GBFS(url)
  return gbfs.validation()
}

parseOptions = () => {
  commander
    .version(pjson.version, '-v, --version')
    .usage('[OPTIONS]...')
    .option('-u, --url <dataset_folder>', 'URL of the GBFS feed')
    .option('-p, --print', 'Print report to console')
    .option('-vb, --verbose', 'Verbose mode prints debugging console logs')
    .option('-s, --save-report <report_path>', 'Local path to output report file')
    .parse(process.argv)

  return commander.opts()
}

const options = parseOptions();

const saveReport = (report, filePath) => { 
  const dirname = fsPath.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(report))
}

const processFeedValidation = async () => {
  if (options.verbose) {
    console.log("Started GBFS validation with options: \n " + inspect(options, { depth: null, colors: true }))
  }
  try {
    const report = await getFeedValidationReport(options.url)
    if (options.print) {
      console.log(inspect(report, { depth: null, colors: true }))
    }
    if (options.saveReport) {
      saveReport(report, options.saveReport)
    }
  } catch (error) {
    console.error(`Critical error while validating GBFS feed => ${error}`)
    process.exit(1);
  }
}

if (options.url) {
  processFeedValidation().then(
    () => {
      if (options.verbose) {
        console.log("Validation completed")
      }
    }
  )
} else {
  commander.help()
  process.exit(1)
}