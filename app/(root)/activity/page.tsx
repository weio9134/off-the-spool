import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchActivity, fetchUser } from '@/lib/actions/user.actions'
import Link from 'next/link'
import Image from 'next/image'

const Page = async () => {
  const user = await currentUser()
  if(!user) return ( <div> NO USER FOUND </div> )
  
  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboard')

  const activities = await fetchActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
      {activities.length === 0 ? <p className="no-result"> No Activities </p> :
        <>
          {activities.map((act) => (
            <Link key={act._id} href={`/thread/${act.parentId}`}>
              <article className="activity-card">
                <Image
                  src={act.author.img}
                  alt="profile img"
                  width={35}
                  height={35}
                  className='rounded-full object-cover'
                />

                <p className='!text-small-regular text-light-1'>
                  <span className='mr-1 text-primary-500'> {act.author.name} </span> { " "}
                  replied to your thread
                </p>
              </article>
            </Link>
          ))}
        </>
      }
      </section>
    </section>
  )
}

export default Page