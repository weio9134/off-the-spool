import Image from 'next/image'
import React from 'react'


type HeaderProp = {
  accountId: string,
  authUserId: string,
  name: string,
  userName: string,
  imgUrl: string,
  bio: string
}

const ProflileHeader = ({ accountId, authUserId, name, userName, imgUrl, bio}: HeaderProp) => {
  return (
    <div className='flex flex-col w-full justify-start'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* load profile image */}
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={imgUrl}
              alt={`profile image`}
              fill={true}
              className='rounded-full object-cover shadow-2xl'
            />
          </div>

          {/* load profile name and username */}
          <div className="flex-1">
            <h2 className='text-left text-heading3-bold text-light-1'> {name} </h2>
            <p className='text-base-medium text-gray-1'> @{userName} </p>
          </div>
        </div>
      </div>
      
      {/* load bio */}
      <p className="mt-6 max-w-lg text-base-regular text-light-2"> {bio} </p>
      <div className='mt-12 h-0.5 w-full bg-dark-3'/>
    </div>
  )
}

export default ProflileHeader