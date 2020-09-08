import fs from 'fs'
import path from 'path'
import { parser } from '../src/index'
import showdown from 'showdown'

const f = fs
  .readFileSync(path.join(__dirname, '../', 'DIC/A/Agnostic.md'))
  .toString()
const ast = parser(f)
const title = getAChildTarget(ast, 'd-title')
const label = getAChildTarget(ast, 'd-label')
const origin = getAChildTarget(ast, 'd-origin')
const mean = getAChildTarget(ast, 'd-mean')
const pronunciation = getAChildTarget(ast, 'd-pronunciation')
const relation = getAChildTarget(ast, 'd-relation')

const titleText = getAChildTarget(title, 'TEXT').text
const originText = getAChildTarget(origin, 'TEXT').text
const pronunciationText = getAChildTarget(pronunciation, 'TEXT').text
let meanText = getAChildTarget(mean, 'span')

if (meanText && meanText.children && meanText.children.length > 0) {
  meanText = getAChildTarget(meanText, 'TEXT').text
} else {
  meanText = getAChildTarget(mean, 'TEXT').text
}

function getAChildTarget(ast, target) {
  if (!ast || !ast.children) {
    return
  }
  return ast.children.filter((value) => {
    if (value.name) return value.name == target
    if (value.type) return value.type == target
  })[0]
}

function getChildrenTarget(ast, target) {
  if (!ast) {
    return
  }
  if (ast.name == target) return ast
  if (ast.type == target) return ast
}

function nomalize(text) {
  // prettier-ignore
  const regex = new RegExp('[^\n #]', 'g')
  return text.trim().match(regex).join('')
}

function nomalizeKey(text) {
  // prettier-ignore
  if (!text.includes(':')) {
    return text
  }
  const regex = new RegExp(':.*', 'g')
  return text.trim().match(regex).join('').substr(':')
}

function regexLabel(text) {
  const regex = new RegExp(/([A-Z])\w+/, 'g')
  return text.match(regex)[0]
}

function loopGet(target, start?, end?, regex?) {
  const rootChildren = target.children
  return rootChildren.map((child) => {
    const d = getChildrenTarget(child, 'd-inner')
    if (!d) return
    const rd = getAChildTarget(d, 'TEXT').text

    if (regex) {
      return regexLabel(rd)
    }

    return nomalize(rd.slice(start, end)) + ' '
  })
}

const converter = new showdown.Converter()
const html = converter.makeHtml(f)

const regex = new RegExp('\n', 'g')

const uglyHtml = html.replace(regex, '')

const contentRegex = new RegExp('<d-content>.*</d-content>', 'g')

const uglyContent = uglyHtml.match(contentRegex)[0]
const content = uglyContent.slice(15, -15)

const result = `
---
title:${nomalize(titleText)}
label:[${loopGet(label, undefined, undefined, true).filter((t) => t)}]
origin: ${nomalizeKey(originText)}
pronunciation: ${nomalizeKey(pronunciationText)}
mean: ${nomalizeKey(meanText)}
relation: [${loopGet(relation, 5).filter((t) => t)}]
slug: "/${nomalize(titleText)[0]}/${nomalize(titleText)}"
---

<content>
${content}
</content>
`

console.log('result', result)
