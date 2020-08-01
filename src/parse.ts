import parseTag from './parse-tag'

// eslint-disable-next-line no-useless-escape
const tagRE = /<[a-zA-Z\-\!\/](?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])*>/g
const TOP_LEVEL = -1

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function parse(html, options = {}) {
  Object.defineProperty(options, 'components', fillCompoentOptions(options))

  const result = []
  const tmpTree = []
  let currentTag
  let level = TOP_LEVEL
  let isInComponent = false

  // 완전 첫번째 루틴에 적용
  result.push(getFirstNodeByToken(html))

  html.replace(tagRE, function (tag, index) {
    const isOpenAndVoid = tag.charAt(1) === '/'
    const isComment = tag.startsWith('<!--')
    const nextStartIndex = index + tag.length
    const nextChar = html.charAt(nextStartIndex)
    console.log('태그:', tag, '보이드:', isOpenAndVoid)

    //컴포넌트 안에서는
    if (isInComponent) {
      isInComponent = validateComponent(tag, currentTag)
    }

    let parent

    if (isComment) {
      const comment = parseTag(tag)

      // 탑 레벨이라면
      if (isTopLevel(level)) {
        result.push(comment)
        return
      }

      parent = tmpTree[level]
      parent.children.push(comment)
      return
    }

    if (isOpenAndVoid) {
      level++
      currentTag = parseTag(tag)

      if (isComponentTag(currentTag, options)) {
        currentTag.type = 'component'
        isInComponent = true
      }

      if (isTextNode(currentTag, isInComponent, nextChar)) {
        currentTag.children.push({
          type: 'text',
          content: html.slice(nextStartIndex, html.indexOf('<', nextStartIndex)),
        })
      }

      if (isTopLevel(level)) {
        result.push(currentTag)
      }

      parent = tmpTree[level - 1] // 한 레벨 위가 부모

      if (parent) {
        parent.children.push(currentTag)
      }

      tmpTree[level] = currentTag // 현재 레벨이 현재
    }

    if (!isOpenAndVoid || currentTag.voidElement) {
      // 열린 태그가 아니거나, 보이드 태그라면
      if (
        level > -1 && // 루트가 아니고
        (currentTag.voidElement || isClose(currentTag, tag)) // 보이드거나, 현재 태그가 닫히는 태그라면
      ) {
        level-- // 한 레벨 올라감
      }
      if (!isInComponent && nextChar !== '<' && nextChar) {
        // 컴포넌트가 아니고 다음 문자열이 태그가 아니고 다음 문자열이 있다면
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        parent = level === -1 ? result : tmpTree[level].children

        // calculate correct end of the content slice in case there's
        // no tag after the text node.
        const end = html.indexOf('<', nextStartIndex)
        const content = html.slice(nextStartIndex, end === -1 ? undefined : end)
        // if a node is nothing but whitespace, no need to add it.
        if (!/^\s*$/.test(content)) {
          parent.push({
            type: 'text',
            content: content,
          })
        }
      }
    }
  })

  console.log('result', result)
  console.log('arr', tmpTree)

  return
}

function isTextNode(currentTag, isInComponent, nextChar) {
  return !currentTag.voidElement && !isInComponent && nextChar && nextChar !== '<'
}

function isComponentTag(currentTag, options) {
  return currentTag.type === 'tag' && options.components[currentTag.name]
}

function isTopLevel(level) {
  return level < 0
}

function getFirstNodeByToken(html) {
  const end = html.indexOf('<')

  const isTagAtFirst = html.indexOf('<') === 0
  const includeAnyTag = end !== -1
  if (isTagAtFirst) {
    return
  }

  return {
    type: 'text',
    content: !includeAnyTag ? html : html.substring(0, end),
  }
}

function fillCompoentOptions(options) {
  const empty = Object.create(null)

  if (options.components) {
    return
  }
  return empty
}

function isClose(currentTag, tag) {
  return currentTag.name === tag.slice(2, -1)
}

function isCloseTag(tag, current) {
  return tag === '</' + current.name + '>'
}

function validateComponent(tag, currentTag) {
  if (!isCloseTag(tag, currentTag)) {
    return
  }
  return false
}
