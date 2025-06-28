"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Navbar() {
    const pathname = usePathname();
  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-2xl w-[600px] shadow-lg'>
        <div className='flex gap-x-2'>
            <Button
            asChild
            variant={pathname === '/server' ? 'default' : 'outline'}
            >
                <Link href='/server'>
                Server
                </Link>
            </Button>

            <Button
            asChild
            variant={pathname === '/settings' ? 'default' : 'outline'}
            >
                <Link href='/settings'>
                Settings
                </Link>
            </Button>

            <Button
            asChild
            variant={pathname === '/client' ? 'default' : 'outline'}
            >
                <Link href='/client'>
                Client
                </Link>
            </Button>

            <Button
            asChild
            variant={pathname === '/Admin' ? 'default' : 'outline'}
            >
                <Link href='/Admin'>
                Admin
                </Link>
            </Button>
        </div>
        <p>User Button</p>
    </nav>
  )
}

export default Navbar