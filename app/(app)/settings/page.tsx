 'use client';
 import React from 'react'
 import { useSession } from 'next-auth/react'

 function page() {
    const {data:session, status} = useSession();
    if (status === 'loading') {
        return <div>Loading...</div>;
    }
   return (
     <div>
        Welcome !, {JSON.stringify(session?.user)}
     </div>
   )
 }
 ``
 export default page