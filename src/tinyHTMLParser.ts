interface Result {
    name?: string,
    type: string, // text, node
    text: string,
    children?: Result[]
  }
  
  interface StackItem {
    tag: Result
  }
  
  export const parseTag = input => {
    input = input.trim();
    const result = {name: 'ROOT', type: 'node', children: []}; 
    const stack = [{tag: result}];
  
    let curr, i = 0
    const j = input.length;
    // eslint-disable-next-line no-cond-assign
    while(curr = stack.pop()){
      while(i < j){
        const cursor = i; // 헷갈리기때문에 조회용으로 따로
        if(input[cursor] === '<'){
          // '<'로 시작하면 태그: A,B의 경우
        } else {
          i = textNode(input, cursor, curr)
        }
      }
    }
    return result;
  }
 
   
//   // 목표: textNode를 생성 + result 배열에 추가 => idx값(텍스트 노드의 마지막 순서값) 반환
  const textNode = (input: string, cursor: number, curr: StackItem): number => {
    const idx = input.indexOf('<', cursor);
    curr.tag.children.push({
      type: 'text', 
      text: input.substring(cursor, idx),
    });
    return idx;
  }