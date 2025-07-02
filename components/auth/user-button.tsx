'use client'

import React from 'react'
import { FaUser } from 'react-icons/fa'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useSession, signOut } from 'next-auth/react'
import { ExitIcon } from '@radix-ui/react-icons'

function UserButton() {
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-12 h-12">
          <AvatarImage src={session?.user?.image || ''} alt="User Avatar" />
          <AvatarFallback>
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={handleLogout}>
          <ExitIcon className="mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
