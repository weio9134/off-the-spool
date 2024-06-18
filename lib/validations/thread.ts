import * as z from 'zod'

export const ThreadValidation = z.object({
  thread: z.string().min(3, {message: "MINIMUM 3 CHARACTERS"}).max(2000, {message: "MAXIMUM 2000 CHARACTERS"}),
  accountId: z.string(),
})

export const CommentValidation = z.object({
  thread: z.string().min(3, {message: "MINIMUM 3 CHARACTERS"}).max(2000, {message: "MAXIMUM 2000 CHARACTERS"}),
})