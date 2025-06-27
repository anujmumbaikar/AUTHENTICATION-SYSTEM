import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-full flex items-center justify-center bg-blue-500'>
        {children}
    </div>
  )
}

export default layout 