"use client"
import React from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { CommentValidation } from '@/lib/validations/thread'
import { addComment } from '@/lib/actions/thread.actions'

type CommentProp = {
  threadId: string,
  currentUserImg: string,
  currentUserId: string,
}

const Comment = ({ threadId, currentUserImg, currentUserId }: CommentProp) => {
  const router = useRouter()
  const pathname = usePathname()

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addComment({
      threadId: threadId,
      text: values.thread,
      userId: JSON.parse(currentUserId),
      path: pathname,
    })

    router.push("/")
  }

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    }
  })

  return (
    <div>
      <h1>commet</h1>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="comment-form"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className='flex gap-3 w-full items-center'>
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt={`profile image`}
                    width={50}
                    height={50}
                    className='rounded-full object-cover'
                  />
                </FormLabel>
                <FormControl className='border-none bg-transparent'>
                  <Textarea
                    rows={1}
                    placeholder='Type your comment...'
                    className='no-focus text-light-1 outline-none'
                    {...field}
                  />
                  {/* <Input
                    type='text'
                    placeholder='Type your comment...'
                    className='no-focus text-light-1 outline-none'
                    {...field}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='comment-form_btn'>Comment</Button>
        </form>
      </Form>
    </div>
  )
}

export default Comment