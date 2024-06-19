import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { formatDateString } from '@/lib/utils';

type ThreadCardProp = {
  id: string;
  currentUserId: string | undefined,
  parentId: string,
  content: string,
  author: {
    name: string,
    img: string,
    id: string
  }
  community: {
    id: string,
    name: string,
    img: string
  } | null
  createdAt: string,
  comments: {
    author: {
      img: string
    }
  }[],
  isComment: boolean
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment
}: ThreadCardProp ) => {
  return (
    <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
      <div className="flex items-start justify-between ">
        <div className="flex w-full flex-1 gap-4 flex-row ">
          {/* display user profile icon */}
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image 
                src={author.img}
                alt="Profile image"
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className='flex w-full flex-col'>
            {/* display user id and content */}
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'> {author.name} </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2"> {content} </p>

            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              {/* display reaction icon */}
              <div className="flex gap-3 5">
                <Image
                  src={`/assets/heart-gray.svg`}
                  alt='heart'
                  width={25}
                  height={25}
                  className='cursor-pointer object-contain'
                />

                {/* redirect to post if reply */}
                <Link href={`/thread/${id}`}>
                  <Image
                    src={`/assets/reply.svg`}
                    alt='reply'
                    width={25}
                    height={25}
                    className='cursor-pointer object-contain'
                  />
                </Link>

                <Image
                  src={`/assets/repost.svg`}
                  alt='repost'
                  width={25}
                  height={25}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src={`/assets/share.svg`}
                  alt='share'
                  width={25}
                  height={25}
                  className='cursor-pointer object-contain'
                />
              </div>

              {/* display comment count */}
              <Link href={`/thread/${id}`}>
                <p className="mt-1 text-subtle-medium text-gray-1">
                  {comments.length} replies
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {!isComment && community && (
        <Link href={`/communities/${community.id}`} className='mt-5 flex items-center'>
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {' '} - {' '}
            {community.name}
          </p>
          <Image
            src={community.img}
            alt={community.name}
            width={15}
            height={15}
            className='ml-1 rounded-full object-cover'
          />
        </Link>
      )}
    </article>
  )
}

export default ThreadCard