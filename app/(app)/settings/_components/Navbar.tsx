"use client";
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserButton from '@/components/auth/user-button';

function Navbar() {
    const pathname = usePathname();
  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-2xl w-[600px] shadow-lg'>
        <div className='flex gap-x-2'>
            <Button
            asChild
            variant={pathname === '/settings/server' ? 'default' : 'outline'}
            >
                <Link href='/settings/server'>
                Server
                </Link>
            </Button>
            <Button
            asChild
            variant={pathname === '/settings/client' ? 'default' : 'outline'}
            >
                <Link href='/settings/client'>
                Client
                </Link>
            </Button>

            <Button
            asChild
            variant={pathname === '/settings/Admin' ? 'default' : 'outline'}
            >
                <Link href='/settings/Admin'>
                Admin
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
        </div>
        <UserButton/>
    </nav>
  )
}

export default Navbar