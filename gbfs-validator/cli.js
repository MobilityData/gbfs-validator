#!/usr/bin/env node

const { inspect } = require('util')
const commander = require('commander')
const fs = require('fs')
const fsPath = require('path')
const GBFS = require('./gbfs')
const pjson = require('./package.json')

getFeedValidationReport = async (url) => {
  const gbfs = new GBFS(url)
  return gbfs.validation()
}

const isExitOverrided = () => (process.env.EXIT_OVERRIDE === 'true')

const printingReport = (options) => (options.printReport === 'yes')

const exitProcess = (code) => {
  if (!isExitOverrided && code === 1) {
    process.exit(code)
  }
  process.exit(0)
}

parseOptions = () => {
  commander
    .version(pjson.version, '-v, --version')
    .usage('[OPTIONS]...')
    .requiredOption('-u, --url <feed_url>', 'URL of the GBFS feed')
    .option('-vb, --verbose', 'Verbose mode prints debugging console logs')
    .option('-s, --save-report <report_path>', 'Local path to output report file')
    .addOption(new commander.Option('-pr, --print-report <yes_no>', 'Print report to standard output').default('yes').choices(['yes', 'no']))

  // Supporting friendly unit testing and possible CI integrations
  // The process throw an exception on parsing error in addition to the parsing error 
  if (isExitOverrided()) {
    commander.exitOverride()
  }
  return commander.parse(process.argv).opts()
}

const saveReport = (report, filePath) => {
  const dirname = fsPath.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(report))
}

const processFeedValidation = async (options) => {
  if (options.verbose) {
    console.log("Started GBFS validation with options: \n " + inspect(options, { depth: null, colors: true }))
  }
  try {
    const report = await getFeedValidationReport(options.url)
    if (printingReport(options)) {
      console.log(inspect(report, { depth: null, colors: true }))
    }
    if (options.saveReport) {
      saveReport(report, options.saveReport)
    }
  } catch (error) {
    console.error(`Critical error while validating GBFS feed => ${error}`)
    exitProcess(1);
  }
}

const validate = () => {
  const options = parseOptions()
  if (!options.saveReport && !printingReport(options)) {
    console.log('Please set at least of the following options: --save-report or --print-report')
    commander.help()
    exitProcess(1)
  }

  processFeedValidation(options).then(
    () => {
      if (options.verbose) {
        console.log("Validation completed")
      }
    }
  )
}

if (require.main === module) {
  validate()
} else {
  module.exports = {
    validate,
    processFeedValidation,
    saveReport,
    getFeedValidationReport,
  }
}