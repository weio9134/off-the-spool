"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import Community from "../models/community.model"

type UserProp = {
  userId: string, 
  username: string,
  name: string,
  bio: string,
  img: string,
  path: string
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  img,
  path
}: UserProp): Promise<void> {
  connectToDB()
  
  try {
    await User.findOneAndUpdate(
      { id: userId },
      { 
        username: username.toLowerCase(),
        name,
        bio,
        img,
        onboarded: true 
      },
      { upsert: true }
    )
  
    if(path === '/profile/edit') revalidatePath(path)

  } catch (error: any) {
    throw new Error(`Failed to create/update user:\n ${error.message}`)
  }
}


export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User
    .findOne({ id: userId })
    .populate({
      path: 'communities',
      model: Community
    })
  } catch (error: any) {
    throw new Error(`Failed to find user:\n ${error.message}`)
  }
}


export async function fetchUserPost(userId: string) {
  try {
    connectToDB()

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    })
    
    return threads
  } catch (error: any) {
    throw new Error(`Failed to find user posts:\n ${error.message}`)
  }
}


type MultiUserProps = {
  userId: string, 
  searchString?: string, 
  pageNumber?: number, 
  pageSize?: number, 
  sortBy?: SortOrder
}

export async function fetchMultipleUsers({ userId, searchString="", pageNumber=1, pageSize=20, sortBy="desc" }: MultiUserProps) {
  try {
    connectToDB()

    const skip = (pageNumber - 1) * pageSize
    const regex = new RegExp(searchString, "i")
    
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }
    }
    
    if(searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex }},
        { name: { $regex: regex }}
      ]
    }

    const sorOpt = { createdAt: sortBy }
    const queryUsers = User
      .find(query)
      .sort(sorOpt)
      .skip(skip)
      .limit(pageSize)
    
    const total = await User.countDocuments(query)
    const users = await queryUsers.exec()
    const isNext = total > skip + users.length
    return { users, isNext }
  } catch (error: any) {
    throw new Error(`Failed to fetch multiple users:\n ${error.message}`)
  }
}



export async function fetchActivity(userId: string) {
  try {
    connectToDB()
    
    const userThread = await Thread.find({ author: userId })
    const childThreadId = userThread.reduce((acc, thread) => {
      return acc.concat(thread.children)
    }, [])

    const replies = await Thread
      .find({
        _id: { $in: childThreadId },
        author: { $ne: userId }
      })
      .populate({
        path: 'author',
        model: User,
        select: ' name img _id'
      })

    return replies
  } catch (error: any) {
    throw new Error(`Failed to fetch activities:\n ${error.message}`)
  }
}