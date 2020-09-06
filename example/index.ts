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

// ---
// title: "Adapter"
// pronunciation: "어뎁터"
// relation: [디자인 패턴, http adapter]
// slug: "/A/Adapter"
// ---

// <content>

// 소프트웨어 엔지니어링에서 <span style="color:#FFBF00; font-weight:bold;">어댑터 패턴은 기존 클래스의 인터페이스를 다른 인터페이스로 사용할 수 있도록하는</span>소프트웨어 디자인 패턴 (데코레이터 패턴과 공유되는 대체 이름인 래퍼라고도 함)입니다. 소스 클래스를 수정하지 않고 기존 클래스를 다른 클래스와 함께 작동시키는 데 종종 사용됩니다.

// XML 문서의 문서 오브젝트 모델의 인터페이스를 표시 할 수있는 트리 구조로 변환하는 어댑터가 그 예입니다.

// ![제목](../2TAT1C/Adapter_1.jpg)

// 이 외에도 형식이 다른 인터페이스를 사용하기 위해 기능과 사용자 사이에서 연결 역할을 하는 기능을 Adapter라 부른다.

// ([위키 백과](https://en.wikipedia.org/wiki/Adapter_pattern))

// </content>
