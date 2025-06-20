import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'
function Social() {
  return (
    <div className='flex items-center w-full gap-x-2'>
        <Button variant='outline' size="lg" className='w-[50%]' onClick={() => alert('Login with GitHub')}>
            <FcGoogle className='h-5 w-5'/>
        </Button>
        <Button variant='outline' size="lg" className='w-[50%]' onClick={() => alert('Login with GitHub')}>
            <FaGithub className='h-5 w-5'/>
        </Button>
    </div>
  )
}

export default Social