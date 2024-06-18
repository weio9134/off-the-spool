import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  if(isConnected) return
    
  mongoose.set('strictQuery', true)
  if(!process.env.MONGODB_URL) return console.log("MONGO DB URL NOT FOUND")

  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true
  } catch (error) {
    console.log(error)
  }
}