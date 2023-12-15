#!/usr/bin/env node

const { inspect } = require('util')
const commander = require('commander')
const fs = require('fs')
const fsPath = require('path')
const GBFS = require('./gbfs')
const pjson = require('./package.json')

/**
 * This async function returns an Object that contains the FileValidationResult of all the files from a GBFS feed.
 * @returns {Object}
 */
getFeedValidationReport = async (url) => {
  const gbfs = new GBFS(url)
  return gbfs.validation()
}

/**
 * This function returns true if exit override param is set to 'true' to allow program to exit simplifying unit testing.
 * @returns {boolean}
 */
const isExitOverrided = () => (process.env.EXIT_OVERRIDE === 'true')

/**
 * This function returns true if print report option is set to 'true'.
 * @param {Object} options - The CLI commander options
 * @returns {boolean}
 */
const printingReport = (options) => (options.printReport === 'yes')

/**
 * This function exits the process
 * @param {number} code - The exit process code
 */
const exitProcess = (code) => {
  if (!isExitOverrided && code === 1) {
    process.exit(code)
  }
  process.exit(0)
}

/**
 * This function defines the options that can be passed by the user to the CLI, 
 * its version and the usage description in the first line of the help.
 */
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

/**
 * This function writes the validation report to a local file.
 * @param {*} report The validation report
 * @param {*} filePath The path to the local file to write
 */
const saveReport = (report, filePath) => {
  const dirname = fsPath.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(report))
}

/**
 * This asyn function validates the feed and saves the report if requested in the options
 * @param {*} options The options passed by the user to the CLI.
 */
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

/**
 * This function checks that the options passed by the user are valid and
 * calls the processFeedValidation() function.
 */
const validate = () => {
  const options = parseOptions()
  if (!options.saveReport && !printingReport(options)) {
    console.log('Please set at least one of the following options: --save-report or --print-report')
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