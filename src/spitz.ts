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
  TEXT,
}

export default (input: string): AST => {
  input = input.trim()

  const result: AST = {
    name: 'ROOT',
    type: 'node',
    children: [],
  }
  const stack: ASTStack[] = [{ tag: result }]
  let curr
  let i = 0
  const j = input.length
  while ((curr = stack.pop())) {
    while (i < j) {
      const cursor = i
      if (input[cursor] === '<') {
        const endIndex = input.indexOf('>', cursor)
        i = endIndex + 1
        if (input[cursor + 1] === '/') {
          curr = curr.back
        } else {
          const isVoidElement = processElementNode(
            input,
            endIndex,
            cursor,
            curr,
            stack,
          )
          if (!isVoidElement) break
        }
      } else {
        const nextStartIndex = processTextNode(input, cursor, curr)
        i = nextStartIndex
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
  let name
  let isClose
  if (input[endIndex - 1] === '/') {
    name = input.substring(cursor + 1, endIndex - 1)
    isClose = true
  } else {
    name = input.substring(cursor + 1, endIndex)
    isClose = false
  }
  const tag = {
    name,
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
