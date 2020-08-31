const fs = require('fs')
const parser = require('../src/parser.js').default

const f = fs.readFileSync('../DIC/A/Adapter.md').toString()
const ast = parser(f)
const title = getChildTarget(ast, 'd-title')
const origin = getChildTarget(ast, 'd-origin')
const mean = getChildTarget(ast, 'd-mean')
const pronunciation = getChildTarget(ast, 'd-pronunciation')
const content = getChildTarget(ast, 'd-content')
const relation = getChildTarget(ast, 'd-relation')

const titleText = getChildTarget(title, 'TEXT').text
const originText = getChildTarget(origin, 'TEXT').text
const pronunciationText = getChildTarget(pronunciation, 'TEXT').text
let meanText = getChildTarget(mean, 'span')

if (meanText && meanText.children && meanText.children.length > 0) {
  meanText = getChildTarget(meanText, 'TEXT').text
} else {
  meanText = getChildTarget(mean, 'TEXT').text
}

function getChildTarget(ast, target) {
  return ast.children.filter((value) => {
    if (value.name) return value.name == target
    if (value.type) return value.type == target
  })[0]
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

const result = `
---
title:${nomalize(titleText)}
origin: ${nomalizeKey(originText)}
pronunciation: ${nomalizeKey(pronunciationText)}
mean: ${nomalizeKey(meanText)}
relation: []
slug: "/${nomalize(titleText)[0]}/${nomalize(titleText)}"
---

<content>

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
