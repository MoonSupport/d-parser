interface AST {
  name: string
  type: string
  children: AST[]
}

interface ASTStack {
  tag: AST
  back?: ASTStack
}

enum Type {
  TEXT = 'TEXT',
  NODE = 'NODE',
}

const ROOT = 'ROOT'

export default (input: string): AST => {
  input = input.trim()

  const result: AST = {
    name: ROOT,
    type: Type.NODE,
    children: [],
  }

  const stack: ASTStack[] = [{ tag: result }]
  let currentStack: ASTStack
  let globalCursor = 0
  const htmlLength = input.length
  while ((currentStack = stack.pop())) {
    while (globalCursor < htmlLength) {
      const cursor = globalCursor
      if (input[cursor] === '<') {
        const endIndex = input.indexOf('>', cursor)
        globalCursor = endIndex + 1
        if (input[cursor + 1] === '/') {
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
function processElementNode(
  input: string,
  endIndex: number,
  cursor: number,
  curr: any,
  stack: ASTStack[],
) {
  //   let name
  //   let isClose
  //   if (input[endIndex - 1] === '/') {
  //     name = input.substring(cursor + 1, endIndex - 1)
  //     isClose = true
  //   } else {
  //     name = input.substring(cursor + 1, endIndex)
  //     isClose = false
  //   }
  //   const tag = {
  //     name,
  //     type: 'node',
  //     children: [],
  //   }
  const isClose = input[endIndex - 1] === '/'
  const tag = {
    name: input.substring(cursor + 1, endIndex - (isClose ? 1 : 0)),
    type: 'node',
    children: [],
  }
  curr.tag.children.push(tag)
  if (!isClose) {
    stack.push({ tag, back: curr })
    return false
  }
  return true
}

function processTextNode(input: string, cursor: number, curr: any) {
  const nextStartIndex = input.indexOf('<', cursor)
  curr.tag.children.push({
    type: Type.TEXT,
    text: input.substring(cursor, nextStartIndex),
  })
  return nextStartIndex
}
