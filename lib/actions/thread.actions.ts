"use server"
import { revalidatePath } from "next/cache"
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import Thread from "../models/thread.model"
import Community from "../models/community.model"

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()

  const skipAmount = (pageNumber - 1) * pageSize
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    })

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  })
  const posts = await postsQuery.exec()
  const isNext = totalPostsCount > skipAmount + posts.length
  return { posts, isNext }
}


type ThreadProps = {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ text, author, communityId, path }: ThreadProps) {
  try {
    connectToDB()
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    )

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    })

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    })

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, { $push: { threads: createdThread._id } })
    }

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`)
  }
}


async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId })

  const descendantThreads = []
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id)
    descendantThreads.push(childThread, ...descendants)
  }

  return descendantThreads
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB()

    const mainThread = await Thread.findById(id).populate("author community")
    if (!mainThread) throw new Error("Thread not found")

    const descendantThreads = await fetchAllChildThreads(id)
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ]

    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    )

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    )

    await Thread.deleteMany({ _id: { $in: descendantThreadIds } })
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    )
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    )

    revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`)
  }
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB()

    const thread = await Thread
      .findById(id)
      .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "community",
          model: Community,
          select: "_id id name image",
        }) // Populate the community field with _id and name
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec()

    return thread
  } catch (error: any) {
    throw new Error(`Failed to fetch thread by id: ${error.message}`)
  }
}

type AddCommentProp = {
  threadId: string,
  text: string,
  userId: string,
  path: string
}
export async function addComment({ threadId, text, userId, path }: AddCommentProp) {
  try {
    connectToDB()
    
    const orig = await Thread.findById(threadId)
    if(!orig) throw new Error("Thread not found")

     // create new thread with comment
     const commentThread = new Thread({
      text: text,
      author: userId,
      parentId: threadId
    })

     // save it and append to orignal thread
     const saveComment = await commentThread.save()
     orig.children.push(saveComment._id)
     await orig.save()
     revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Failed to add comment:\n ${error.message}`)
  }
}