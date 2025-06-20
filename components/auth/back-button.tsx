import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link';

interface BackButtonProps {
    href: string;
    label: string;
}

function BackButton({ href, label }: BackButtonProps) {
  return (
    <div>
        <Button
        variant="link" className='font-normal w-full' size="sm" asChild>
            <Link href={href}>
            {label}
            </Link>
        </Button>
    </div>
  )
}

export default BackButton