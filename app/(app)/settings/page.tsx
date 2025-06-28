 'use client';
 import React from 'react'
 import { useSession } from 'next-auth/react'

 function page() {
    const {data:session, status} = useSession();
    if (status === 'loading') {
        return <div>Loading...</div>;
    }
   return (
     <div className='bg-white p-10 rounded-2xl'>
        hi
     </div>
   )
 }
 ``
 export default page