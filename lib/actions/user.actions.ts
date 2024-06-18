"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

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