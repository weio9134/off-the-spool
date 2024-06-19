import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchMultipleUsers, fetchUser } from '@/lib/actions/user.actions'
import UserCard from '@/components/cards/UserCard'
import { fetchCommunities } from '@/lib/actions/community.actions'
import CommunityCard from '@/components/cards/CommunityCard'

const Page = async () => {
  const user = await currentUser()
  if(!user) return ( <div> NO USER FOUND </div> )
  
  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboard')

  const result = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  })

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-row gap-9 justify-evenly">
        {result.communities.length === 0 ? <p className="no-result"> No Users </p> :
          <>
            {result.communities.map((comm) => (
              <CommunityCard
                key={comm.id}
                id={comm.id}
                name={comm.name}
                username={comm.username}
                img={comm.image}
                bio={comm.bio}
                members={comm.members}
              />
            ))}
          </>
        }
      </div>
    </section>
  )
}

export default Page