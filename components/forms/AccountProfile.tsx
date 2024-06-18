"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import { UserValidation } from '@/lib/validations/user'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'

type ProfileProps = {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    img: string
  };
  title: string
}

const AccountProfile = ({user, title}: ProfileProps) => {
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media")
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user.img || '',
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
    }
  })

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, change: (value: string) => void) => {
    e.preventDefault()
    const fileReader = new FileReader()
    if(e.target.files && e.target.files.length >= 1) {
      const file = e.target.files[0]
      setFiles(Array.from(e.target.files))

      if(!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const dataURL = event.target?.result?.toString() || '';
        change(dataURL)
      }

      fileReader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo
    const hasChanged = isBase64Image(blob)

    // update user photo
    if(hasChanged) {
      const response = await startUpload(files)
      if(response && response[0].url) {
        values.profile_photo = response[0].url
      }
    }

    // update user profile
    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      img: values.profile_photo,
      path: pathname
    })

    if(pathname === '/profile/edit') router.back()
    else router.push('/')
  }

  return (
    <div>
      AccountProfile
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col justify-start gap-10"
        >
          {/* input profile picture */}
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className='flex items-center gap-4'>
                <FormLabel className='account-form_image-label'>
                  <Image
                    src={field.value ? field.value : "/assets/profile.svg"}
                    alt="profile photo"
                    width={field.value ? 100 : 50}
                    height={field.value ? 100 : 50}
                    priority={true}
                    className={`${field.value && 'rounded-full'} object-contain`}
                  />
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Input 
                    type='file'
                    accept='image/*'
                    placeholder='Upload a profile photo'
                    className='account-form_image-input'
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* input name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className='flex gap-3 w-full flex-col'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Name
                </FormLabel>
                <FormControl>
                  <Input 
                    type='text'
                    placeholder='Input your name'
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* input username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className='flex gap-3 w-full flex-col'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Username
                </FormLabel>
                <FormControl>
                  <Input 
                    type='text'
                    placeholder='Input your username'
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* input bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className='flex gap-3 w-full flex-col'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea 
                    rows={10}
                    placeholder='Input your bio'
                    className='account-form_input no-focus'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='bg-primary-500'>Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default AccountProfile
