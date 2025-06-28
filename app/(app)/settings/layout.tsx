import React from 'react'
import Navbar from './_components/Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-full w-full flex flex-col gap-y-10 items-center justify-center bg-blue-500'>
      <Navbar/>
        {children}
    </div>
  )
}

export default layout