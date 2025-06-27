'use client'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'
function Social() {
  return (
    <div className='flex items-center w-full gap-x-2'>
        <Button 
        onClick={() => {
          signIn("google", { callbackUrl: "/dashboard" });
        }} 
        variant='outline' size="lg" className='w-[50%]'>
            <FcGoogle className='h-5 w-5'/>
        </Button>
        <Button
        onClick={() => {
          signIn("github", { callbackUrl: "/dashboard" });
        }}
        variant='outline' size="lg" className='w-[50%]'
        >
            <FaGithub className='h-5 w-5'/>
        </Button>
    </div>
  )
}

export default Social