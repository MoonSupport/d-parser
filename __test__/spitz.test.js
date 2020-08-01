var assert = require('assert')
var { processTextNode } = require('../build/process.js')
describe('process', function () {
  describe('processTextNode', function () {
    it('Only TextNode', function () {
      const text = `This is Test`
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(text, 0, mockASTStack)
      assert.equal(nextTextNode, -1)
    })
  })
})
