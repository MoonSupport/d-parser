import { Type, ASTStack, AST } from './type'

export function processTextNode(
  input: string,
  cursor: number,
  curr: ASTStack,
): number {
  const nextStartIndex = input.indexOf('<', cursor)
  curr.tag.children.push({
    type: Type.TEXT,
    text: input.substring(
      cursor,
      nextStartIndex > -1 ? nextStartIndex : input.length,
    ),
  })
  return nextStartIndex
}

export function processElementNode(
  input: string,
  endIndex: number,
  cursor: number,
  curr: ASTStack,
  stack: ASTStack[],
): boolean {
  const isClose = input[endIndex - 1] === '/'
  const parsedTag = parseTagName(input, cursor, endIndex, isClose)
  const attrs = []
  parseAttr(parsedTag, attrs)
  const tag = {
    name: parsedTag[0],
    attr: attrs,
    type: Type.NODE,
    children: [],
  }
  curr.tag.children.push(tag)
  if (!isClose) {
    stack.push({ tag, back: curr })
    return false
  }
  return true
}

function parseAttr(parsedTag: string[], attrs: Pair[]) {
  parsedTag.map((attr, idx) => {
    if (idx > 0 && attr) {
      const parsedAttr = attr.split('=')
      attrs.push({ [parsedAttr[0]]: parsedAttr[1] && parsedAttr[1].slice(1, -1) })
    }
  })
}

export function initRootStack(result: AST): ASTStack[] {
  return [{ tag: result }]
}

function parseTagName(input, cursor, endIndex, isClose): string[] {
  return input.substring(cursor + 1, endIndex - (isClose ? 1 : 0)).split(' ')
}

interface Pair {
  [key: string]: string
}
