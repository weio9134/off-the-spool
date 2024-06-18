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


export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const postsQuery = Thread
      .find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId img",
        },
      });

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch posts:\n ${error.message}`)
  }
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB();

    const thread = await Thread
      .findById(id)
      .populate({
        path: 'author',
        model: User,
        select: "_id id name img"
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: "_id id name parentId img"
          }, 
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: "_id id name parentId img"
            }
          }
        ]
      })
      .exec()

      return thread
  } catch (error: any) {
    throw new Error(`Failed to fetch post by id:\n ${error.message}`)
  }
}