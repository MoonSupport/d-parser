import { Type, ASTStack, AST } from './type'

export function processTextNode(
  input: string,
  cursor: number,
  curr: ASTStack,
): number {
  const nextStartIndex = input.indexOf('<', cursor)
  curr.tag.children.push({
    type: Type.TEXT,
    text: input.substring(cursor, nextStartIndex),
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
  const tag = {
    name: input.substring(cursor + 1, endIndex - (isClose ? 1 : 0)),
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

export function initRootStack(result: AST): ASTStack[] {
  return [{ tag: result }]
}
