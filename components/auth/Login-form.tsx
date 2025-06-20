"use client"
import React from 'react'
import * as z from 'zod'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { Form,FormControl,FormLabel,FormItem,FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form-error'
import FormSuccess from '../form-success'

function LoginForm() {
  const [error,setError] = React.useState<string | null>(null)
  const [success,setSuccess] = React.useState<string | null>(null)
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log('Form submitted with values:', values);
  }

  return (
    <CardWrapper
        headerLabel="Welcome Back"
        backButtonLabel="Don't have an account? Sign up"
        backButtonHref="/auth/register"
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
            <FormError errorMessage='something went wrong'/>
            <FormSuccess successMessage='Email sent!'/>
            <Button
              type='submit'
              className='w-full'
            >
              Login
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm