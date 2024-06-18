"use server"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

type ThreadProps = {
  text: string,
  author: string,
  communityId: string | null,
  path: string
}

export const createThread = async ({ text, author, communityId, path }: ThreadProps) => {
  try {
    connectToDB()

    const created = await Thread.create({
      text,
      author,
      community: null,
    })

    await User.findByIdAndUpdate(author, { $push: { threads: created._id } })

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create/update user:\n ${error.message}`)
  }
}