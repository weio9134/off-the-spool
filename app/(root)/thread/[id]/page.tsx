import ThreadCard from '@/components/cards/ThreadCard'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchThreadById } from '@/lib/actions/thread.actions'

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
    </section>
  )
}

export default Page