const http = require('http')
const { expect } = require('chai')
var parser = require('../../build/parser').default

var { Type } = require('../../build/type')
var {
  processTextNode,
  processElementNode,
  initRootStack,
} = require('../../build/process.js')

let html = ''
describe('process', function () {
  before(function (done) {
    try {
      http.get('http://info.cern.ch/', function (res) {
        res.setEncoding('utf8')
        res.on('data', function (data) {
          html += data
        })
        done()
      })
    } catch (e) {
      done(e)
    }
  })
  describe('parsing template', function () {
    it('get html', function () {
      const ast = parser(html)
      expect(ast.name).to.equal('ROOT')
      expect(ast.type).to.equal('NODE')
      expect(ast.children).to.have.lengthOf(1)

      //   expect.equal(ast.name, 'ROOT')
      //   expect.equal(ast.type, 'NODE')
      //   expect.empty(ast.children.length)
    })
  })
})
