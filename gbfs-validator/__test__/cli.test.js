const GBFS = require('../gbfs')
const cli = require('../cli.js')

describe('cli', () => {

  let mockValidate
  let mockExit

  beforeAll(async () => {
    mockValidate = jest.fn()
    GBFS.prototype.validation = mockValidate;
    jest.spyOn(GBFS.prototype, 'validation').mockImplementation(mockValidate)
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { })
  })

  test('should show help without parameters', async () => {
    let stdOut = ""
    jest
      .spyOn(console._stdout, 'write')
      .mockImplementation(message => {
        stdOut += message
      })

    await cli.validate()

    expect(mockExit).toHaveBeenCalledWith(1)
    expect(stdOut).toContain("Usage:")
  })

  test('should execute GBFS validate', async () => {
    const result = jest.fn();
    mockValidate.mockReturnValue(result)
    const expected = await cli.validate({ url: "gbfs_url" })
    expect(mockExit).toHaveBeenCalledWith(1)
    expect(mockValidate).toHaveBeenCalled()
  })
})