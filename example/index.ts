import fs from 'fs'
import path from 'path'
import { parser } from '../src/index'
import showdown from 'showdown'

const f = fs.readFileSync(path.join(__dirname, '../', 'DIC/A/Adapter.md')).toString()
const ast = parser(f)
const title = getAChildTarget(ast, 'd-title')
const origin = getAChildTarget(ast, 'd-origin')
const mean = getAChildTarget(ast, 'd-mean')
const pronunciation = getAChildTarget(ast, 'd-pronunciation')
const content = getAChildTarget(ast, 'd-content')
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

function loopGet(target) {
  const rootChildren = target.children
  return rootChildren.map((child) => {
    const d = getChildrenTarget(child, 'd-inner')
    if (!d) return
    const rd = getAChildTarget(d, 'TEXT').text
    return nomalize(rd.slice(5))
  })
}

const converter = new showdown.Converter()
const html = converter.makeHtml(f)

console.log(html)

const result = `
---
title:${nomalize(titleText)}
origin: ${nomalizeKey(originText)}
pronunciation: ${nomalizeKey(pronunciationText)}
mean: ${nomalizeKey(meanText)}
relation: [${loopGet(relation).filter((t) => t)}]
slug: "/${nomalize(titleText)[0]}/${nomalize(titleText)}"
---

<content>
${content}
</content>
`

console.log('result', result)
