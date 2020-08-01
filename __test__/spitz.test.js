var assert = require('assert')
var { Type } = require('../build/type')
var { processTextNode } = require('../build/process.js')
describe('process', function () {
  describe('processTextNode', function () {
    it('Only TextNode', function () {
      const body = `This is Test`
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(body, 0, mockASTStack)
      assert.equal(nextTextNode, -1)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })

    it('get Next Node', function () {
      const textBody = `This is Test`

      const body = `${textBody}<div>tag</div>`
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(body, 0, mockASTStack)
      assert.equal(nextTextNode, textBody.length)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })
  })
})
