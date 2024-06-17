"use client"
import React from 'react'
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
  }

  const onSubmit = (values: z.infer<typeof UserValidation>) => {

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