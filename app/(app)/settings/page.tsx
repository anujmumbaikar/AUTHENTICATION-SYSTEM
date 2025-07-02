 'use client';
 import React from 'react'
 import { useSession,signOut } from 'next-auth/react'

 function page() {
    const {data:session} = useSession();
   return (
     <div className='bg-white p-10 rounded-2xl'>

     </div>
   )
 }
 ``
 export default page