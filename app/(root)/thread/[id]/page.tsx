import ThreadCard from '@/components/cards/ThreadCard'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import Comment from '@/components/forms/Comment'

const Page = async ({ params }: { params: { id: string }}) => {
  if(!params.id) return ( <div> NO THREAD FOUND </div> )

  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if(!userInfo.onboarded) redirect('/onboard')

  const thread = await fetchThreadById(params.id)

  return (
    <section className="relative">
      <div>
        <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id ?? ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={false}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.img}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((comm: any) => (
          <ThreadCard 
            key={comm._id}
            id={comm._id}
            currentUserId={user?.id ?? ""}
            parentId={comm.parentId}
            content={comm.text}
            author={comm.author}
            community={comm.community}
            createdAt={comm.createdAt}
            comments={comm.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  )
}

export default Page