import React from 'react'


interface HeaderProps {
    label: string;
}
function Header({ label }: HeaderProps) {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center'>
        <h1 className='text-4xl font-bold '>Auth</h1>
        <p className='text-muted-foreground text-lg font-extrabold'>
            {label}
        </p>
    </div>
  )
}

export default Header