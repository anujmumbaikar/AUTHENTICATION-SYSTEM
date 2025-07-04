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
import { Input } from '@/components/ui/input'
import FormSuccess from '@/components/form-success'
import FormError from '@/components/form-error'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { UserRole } from '@prisma/client'
function Page() {
  const { data: session,update} = useSession()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: session?.user?.name || undefined,
      email: session?.user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.USER
        ? session.user.role
        : undefined,
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
        name: values.name,
      })
      if (res.status === 200) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: values.name,
          }
        })
        setSuccess('Settings updated successfully')
      } else {
        setError('Failed to update settings')
        setSuccess(null)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An error occurred while updating settings')
      } else {
        setError('An unexpected error occurred')
      }
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {!session?.user?.isOauth && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter your email"
                          className="input input-bordered w-full p-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="input input-bordered w-full p-2"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="password"
                          placeholder="Enter your new password"
                          className="input input-bordered w-full p-2"
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            {!session?.user?.isOauth && (
              <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm font-medium'>Enable Two-Factor Authentication</FormLabel>
                    <FormDescription className='text-xs text-muted-foreground'>
                      Add an extra layer of security to your account.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            )}
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
