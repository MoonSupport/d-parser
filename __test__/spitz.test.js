var assert = require('assert')
var index = require('../build/spitz.js')
describe('First Test', function () {
  it('sum', function () {
    assert.equal(index.sum(1, 2), 3)
  })
})