export interface AST {
  name?: string
  type: string
  text?: string
  children?: AST[]
}

export interface ASTStack {
  tag: AST
  back?: ASTStack
}

export enum Type {
  TEXT = 'TEXT',
  NODE = 'NODE',
}
