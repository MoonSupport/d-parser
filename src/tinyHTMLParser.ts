interface Result {
  name?: string
  type: string // text, node
  text?: string
  children?: Result[]
}

interface StackItem {
  tag: Result
}

export const parseTag = (input: string): Result => {
  input = input.trim()
  const result = { name: 'ROOT', type: 'node', children: [] }
  const stack = [{ tag: result }]

  let curr,
    i = 0
  const j = input.length
  while ((curr = stack.pop())) {
    while (i < j) {
      const cursor = i
      if (input[cursor] === '<') {
        // no empty
      } else {
        i = textNode(input, cursor, curr)
      }
    }
  }
  return result
}

const textNode = (input: string, cursor: number, curr: StackItem): number => {
  const idx = input.indexOf('<', cursor)
  curr.tag.children.push({
    type: 'text',
    text: input.substring(cursor, idx),
  })
  return idx
}
