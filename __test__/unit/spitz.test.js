var assert = require('assert')
var { Type } = require('../../build/type')
var { processTextNode } = require('../../build/process.js')
describe('process', function () {
  describe('processTextNode', function () {
    const textBody = `This is Test`
    it('Only TextNode', function () {
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(textBody, 0, mockASTStack)
      assert.equal(nextTextNode, -1)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })

    it('get Next Node', function () {
      const textAndNodebody = `${textBody}<div>tag</div>`
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(textAndNodebody, 0, mockASTStack)
      assert.equal(nextTextNode, textBody.length)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })
  })

  describe('processElementtNode', function () {
    it('Only TextNode', function () {
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(textBody, 0, mockASTStack)
      assert.equal(nextTextNode, -1)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })

    it('get Next Node', function () {
      const textAndNodebody = `${textBody}<div>tag</div>`
      const mockASTStack = { tag: { children: [] } }
      const nextTextNode = processTextNode(textAndNodebody, 0, mockASTStack)
      assert.equal(nextTextNode, textBody.length)
      assert.deepEqual(mockASTStack.tag.children[0], {
        type: Type.TEXT,
        text: 'This is Test',
      })
    })
  })
})
