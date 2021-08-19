const GBFS = require('../gbfs')

test('should export GBFS class', () => {
  const gbfs = require('../index')

  expect(gbfs).toBe(GBFS)
})
