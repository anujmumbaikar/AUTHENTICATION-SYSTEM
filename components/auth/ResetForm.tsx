"use client"
import React from 'react'
import * as z from 'zod'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetSchema } from '@/schemas'
import { Form,FormControl,FormLabel,FormItem,FormMessage, FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FormError from '../form-error'
import {signIn} from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import FormSuccess from '../form-success'
function ResetForm() {
  const [error,setError] = React.useState<string | null>(null)
  const [success,setSuccess] = React.useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    }
  })
  const onSubmit = async(values: z.infer<typeof ResetSchema>) => {
    try {
        const res = await axios.post('/api/reset-password', {
            email: values.email
        })
        if (res.status === 200) {
            setSuccess("Reset email sent successfully.")
            form.reset()
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            setError(error.response?.data?.error || "An error occurred while sending reset email.")
        } else {
            setError("An unexpected error occurred.")
        }
        setSuccess(null)
    }
    // const result = await signIn('credentials',{
    //   redirect:false,
    //   email:values.email,
    // })
    // if(result?.error){
    //   toast.error(result.error)
    // }
    // if(result?.ok){ 
    //   toast.success("Login Successful")
    //   router.replace('/dashboard')
    // }
  }
  return (
    <CardWrapper
        headerLabel="Forgot Your Password"
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
            </div>
            {error && <FormError errorMessage={error}/>}
            {success && <FormSuccess successMessage={success} />}
            <Button
              type='submit'
              className='w-full'
            >
              Send reset email
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default ResetForm