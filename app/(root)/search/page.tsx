import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchMultipleUsers, fetchUser } from '@/lib/actions/user.actions'
import UserCard from '@/components/cards/UserCard'

const Page = async () => {
  const user = await currentUser()
  if(!user) return ( <div> NO USER FOUND </div> )
  
  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboard')

    const result = await fetchMultipleUsers({
      userId: user.id,
      searchString: '',
      pageNumber: 1,
      pageSize: 25
    })
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? <p className="no-result"> No Users </p> :
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                img={user.img}
                type={'User'}
              />
            ))}
          </>
        }
      </div>
    </section>
  )
}

export default Page