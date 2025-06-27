"use client"
import React from 'react'
import * as z from 'zod'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form,FormControl,FormLabel,FormItem,FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import { RegisterSchema } from '@/schemas'
import { useRouter } from 'next/navigation'
import axios from 'axios'
function RegisterForm() {
  const [error,setError] = React.useState<string | null>(null)
  const [success,setSuccess] = React.useState<string | null>(null)
  const router = useRouter()
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    console.log('Form submitted with values:', values);
    try {
      const response = await axios.post('/api/register', values)
      if( response.status === 200) {
        setSuccess('Registration successful! Please check your email to verify your account.')
        form.reset()
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000) 
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error || 'An error occurred during registration.')
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }
  return (
    <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
    >
        <Form {...form}>
          <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
          >
            <div className='spcae-y-4'>
                <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field}
                      placeholder='Your name'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>    
                )}  
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field}
                      placeholder='Enter your email'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>    
                )}  
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field}
                      placeholder='Enter your password'
                      type='password'
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
              Create an account
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default RegisterForm