"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"

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
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to find user:\n ${error.message}`)
  }
}


export async function fetchUserPost(userId: string) {
  try {
    connectToDB()

    const threads = await User
      .findOne({ id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: "name img id",
          },
        }
    });
    
      return threads
  } catch (error: any) {
    throw new Error(`Failed to find user posts:\n ${error.message}`)
  }
}