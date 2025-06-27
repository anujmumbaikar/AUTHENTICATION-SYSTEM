"use client"
import React from 'react'
import * as z from 'zod'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewPasswordSchema } from '@/schemas'
import { Form,FormControl,FormLabel,FormItem,FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form-error'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import FormSuccess from '../form-success'

function NewPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
  const [error,setError] = React.useState<string | null>(null)
  const [success,setSuccess] = React.useState<string | null>(null)
  const router = useRouter()
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    }
  })
  const onSubmit = async(values: z.infer<typeof NewPasswordSchema>) => {
    try {
      const response = await axios.post('/api/auth/new-password', {
        password: values.password,
        token: token
      })
      if (response.status === 200) {
        setSuccess('Password reset successfully. You can now login with your new password.')
        form.reset()
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred while resetting the password.')
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }
  return (
    <CardWrapper
        headerLabel="Enter a new Password"
        backButtonLabel="Back to Login"
        backButtonHref="/auth/login"
    >
        <Form {...form}>
          <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
          >
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field}
                      type='password'
                      placeholder='Enter your new password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>    
                )}  
              />
            </div>
            {error && <FormError errorMessage={error}/>}
            {success && <FormSuccess successMessage={success} />}
            <Button
              type='submit'
              className='w-full'
            >
              Reset Password
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default NewPasswordForm