import { AST, ASTStack, Type } from './type'
import { processTextNode, processElementNode, initRootStack } from './process'

const ROOT = 'ROOT'
const INIT_CURSOR = 0

export default (input: string): AST => {
  input = input.trim()

  const result: AST = {
    name: ROOT,
    type: Type.NODE,
    children: [],
  }

  const stack: ASTStack[] = initRootStack(result)

  let currentStack: ASTStack
  let globalCursor = INIT_CURSOR

  const htmlLength = input.length

  while ((currentStack = stack.pop())) {
    while (globalCursor < htmlLength) {
      const cursor = globalCursor
      if (input[cursor] === '<') {
        const endIndex = input.indexOf('>', cursor)
        globalCursor = getNextStartIndex(endIndex)
        if (isCloseTag(input, cursor)) {
          currentStack = currentStack.back
        } else {
          const isVoidElement = processElementNode(
            input,
            endIndex,
            cursor,
            currentStack,
            stack,
          )
          if (!isVoidElement) break
        }
      } else {
        const nextStartIndex = processTextNode(input, cursor, currentStack)
        globalCursor = nextStartIndex
      }
    }
  }

  return result
}
function getNextStartIndex(endIndex: number): number {
  return endIndex + 1
}

function isCloseTag(input: string, cursor: number) {
  return input[cursor + 1] === '/'
}
