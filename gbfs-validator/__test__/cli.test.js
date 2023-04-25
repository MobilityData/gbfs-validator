const serverOpts = {
  port: 0,
  host: '127.0.0.1',
}

describe('cli', () => {
  describe('without arguments', () => {
    test('should show help without required url', async () => {
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
      const mockConsoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      expect(() => {
        require('../cli.js')
      }).toThrow('Missing URL')

      expect(mockExit).toHaveBeenCalledWith(1)
    })
  })

  describe('with arguments', () => {
    let gbfsFeedServer

    beforeAll(async () => {
      gbfsFeedServer = require('./fixtures/server')()

      await gbfsFeedServer.listen(serverOpts)

      return gbfsFeedServer
    })

    afterAll(() => {
      return gbfsFeedServer.close()
    })

    test('should run cli', async () => {
      const url = `http://${gbfsFeedServer.server.address().address}:${
        gbfsFeedServer.server.address().port
      }`

      process.argv[2] = url

      const cli = await require('../cli.js')

      expect(cli).toMatchObject({
        summary: expect.objectContaining({
          version: { detected: '2.2', validated: '2.2' },
          hasErrors: true,
          validatorVersion: '1.0.0',
          errorsCount: 1
        }),
        files: expect.any(Array)
      })
    })
  })
})
