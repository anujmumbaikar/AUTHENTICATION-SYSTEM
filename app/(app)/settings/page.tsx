'use client'

import React from 'react'
import * as z from 'zod'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { settingsSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'

function Page() {
  const { data: session} = useSession()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
    }
  })
  const handleUpdate = async (values: z.infer<typeof settingsSchema>) => {
    try {
      const userId = session?.user?._id
      if (!userId) {
        console.error('No user ID found')
        return
      }
      const res = await axios.put(`/api/settings?userId=${userId}`, {
        values,
      }).then((response) => {
        if (response.status === 200) {
          setSuccess('Updated successfully!')
          setError(null)
          form.reset()
        }
      })
    } catch (error) {
      setError('Failed to update name. Please try again later.')
      setSuccess(null)
    }
  }
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-6'
          onSubmit={form.handleSubmit(handleUpdate)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      className="input input-bordered w-full p-2"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <Button type="submit" className='w-full'>Update</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Page
