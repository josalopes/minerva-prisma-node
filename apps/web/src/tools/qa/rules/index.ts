import { NoConsoleRule } from './qa001-no-console.rule'
import { TodoCommentsRule } from './qa002-todo-comments.rule'
import { EmptyCatchRule } from './qa003-empty-catch.rule'

export * from './base-rule'
export * from './qa001-no-console.rule'
export * from './qa002-todo-comments.rule'
export * from './qa003-empty-catch.rule'

export const defaultRules = [
  new NoConsoleRule(),
  new TodoCommentsRule(),
  new EmptyCatchRule(),
]
