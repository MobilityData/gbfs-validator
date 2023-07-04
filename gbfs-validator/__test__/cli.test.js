let path = require('path')
let exec = require('node:child_process').exec

const serverOpts = {
  port: 0,
  host: '127.0.0.1',
}

const cliExec = (args) => {
  const command = `${path.resolve(`${__dirname}/../cli.js`)} ${args.join(' ')}`
  return new Promise(resolve => {
    exec(command,
      // Setting exit override to allow program to exit simplifying unit testing
      { env: { ...process.env, 'EXIT_OVERRIDE': 'true'}},
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      })
  })
}

describe('cli', () => {

  let gbfsFeedServer
  let feedUrl

  beforeAll(async () => {
    gbfsFeedServer = require('./fixtures/server')()
    const result = await gbfsFeedServer.listen(serverOpts)
    feedUrl = `http://${gbfsFeedServer.server.address().address}:${gbfsFeedServer.server.address().port}/gbfs.json`
    return result
  })

  afterAll(() => {
    return gbfsFeedServer.close()
  })

  test('should show an error if url parameter is not set', async () => {
    const result = await cliExec([])
    expect(result.code).toBe(1)
    expect(result.error.message).toContain('error: required option \'-u, --url [feed_url]\' not specified')
  })

  test('should success and print the report when url parameter set and -pr is set as default', async () => {
    const result = await cliExec([`-u`, `${feedUrl}`])
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('summary:')
  })

  test('should show an error if pr parameter is set to `no` and -s is not set', async () => {
    const result = await cliExec([`-u ${feedUrl}`, '-pr no'])
    expect(result.code).toBe(1)
    expect(result.stdout).toContain('Please set at least of the following options: --save-report or --print-report')
  })

  test('should success when paramters url and save report has valid values and print report is set to no', async () => {
    const result = await cliExec([`-u ${feedUrl}`, '-s /dev/null', '-pr no'])
    expect(result.code).toBe(0)
  })

  test('should success and print report when paramters url and save report are valid and print report is set to yes', async () => {
    const result = await cliExec([`-u ${feedUrl}`, '-s /dev/null', '-pr yes'])
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('summary:')
  })
})