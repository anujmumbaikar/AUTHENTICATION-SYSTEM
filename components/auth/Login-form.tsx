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
import {signIn} from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import FormSuccess from '../form-success'
import Link from 'next/link'
function LoginForm() {
  const [error,setError] = React.useState<string | null>(null)
  const [success,setSuccess] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "This account is already linked with another provider. Please login with that provider." : ""
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async(values: z.infer<typeof LoginSchema>) => {
    try {
      const response = await axios.post('/api/email-verification', {
        email: values.email
      })
      setSuccess("Verification email sent successfully.")
    } catch (error) {
      if(axios.isAxiosError(error)){
        setError(error.response?.data?.error || "An error occurred while sending verification email.")
      } else {
        setError("An unexpected error occurred.")
      }
      return
    }
    const result = await signIn('credentials',{
      redirect:false,
      email:values.email,
      password:values.password
    })
    if(result?.error){
      toast.error(result.error)
    }
    if(result?.ok){ 
      toast.success("Login Successful")
      router.replace('/dashboard')
    }
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
            <div className='space-y-4'>
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
                    <Button size='sm' variant='link' asChild className='px-0 font-bold'>
                      <Link href='/auth/reset'>
                        Forgot Password?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>    
                )}  
              />
            </div>
            {error && <FormError errorMessage={error}/>}
            {urlError && <FormError errorMessage={urlError}/>}
            {success && <FormSuccess successMessage={success} />}
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