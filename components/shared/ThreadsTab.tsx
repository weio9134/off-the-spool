import { fetchUserPost } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'
import ThreadCard from '../cards/ThreadCard'

type ThreadsTabProps = {
  currentUserId: string,
  accountId: string,
  accountType: string
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
  let result = await fetchUserPost(accountId)
  if(!result) redirect('/')

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User" ? 
            { 
              name: result.name, 
              img: result.img, 
              id: result.id 
            } : {
              name: thread.author.name,
              img: thread.author.img,
              id: thread.author.id,
            }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={true}
        />
      ))}
    </section>
  )
}

export default ThreadsTab