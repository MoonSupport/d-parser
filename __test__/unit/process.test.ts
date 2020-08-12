var assert = require('assert')
var { Type } = require('../../build/type')
var {
  processTextNode,
  processElementNode,
  initRootStack,
} = require('../../build/process.js')
var fs = require('fs')

describe('process', function () {
  describe('Util Test', function () {
    it('read Mock', function () {
      assert(
        fs.readFileSync('./__test__/unit/mock.html', {
          encoding: 'utf8',
        }),
      )
    })
  })

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
    it('void Element', function () {
      const result = {
        name: 'ROOT',
        type: Type.NODE,
        children: [],
      }
      const stack = initRootStack(result)
      const voidElement = `<img />`
      const endIndex = voidElement.indexOf('>', 0)
      const currentStack = stack.pop()
      const isClose = processElementNode(
        voidElement,
        endIndex,
        0,
        currentStack,
        stack,
      )
      assert.equal(isClose, true)
      assert.deepEqual(result, {
        name: 'ROOT',
        type: 'NODE',
        children: [{ name: 'img', type: 'NODE', children: [] }],
      })
    })

    it('open Element', function () {
      const result = {
        name: 'ROOT',
        type: Type.NODE,
        children: [],
      }
      const stack = initRootStack(result)
      const element = `<div>test<div/>`
      const endIndex = element.indexOf('>', 0)
      const currentStack = stack.pop()
      const isClose = processElementNode(element, endIndex, 0, currentStack, stack)
      assert.equal(isClose, false)
      assert.deepEqual(result, {
        name: 'ROOT',
        type: 'NODE',
        children: [{ name: 'div', type: 'NODE', children: [] }],
      })
    })
  })
})
