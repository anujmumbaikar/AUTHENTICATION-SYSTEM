"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function page() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <Card className='w-[600px] shadow-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-semibold text-center'>Loading...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    if (!session) {
        return (
            <Card className='w-[600px] shadow-md'>
                <CardHeader>
                    <CardTitle className='text-2xl font-semibold text-center'>Please sign in</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className='w-[600px] shadow-md'>
            <CardHeader>
                <CardTitle className='text-2xl font-semibold text-center'>Welcome to the App</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                    <p className='text-sm font-semibold'>
                        ID
                    </p>
                    <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
                        {session?.user?._id || 'N/A'}
                    </p>
                </div>
                <div className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                    <p className='text-sm font-semibold'>
                        Name
                    </p>
                    <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
                        {session?.user?.name || 'N/A'}
                    </p>
                </div>
                <div className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                    <p className='text-sm font-semibold'>
                        Email
                    </p>
                    <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
                        {session?.user?.email || 'N/A'}
                    </p>
                </div>
                <div className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                    <p className='text-sm font-semibold'>
                        Role
                    </p>
                    <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
                        {session?.user?.role || 'N/A'}
                    </p>
                </div>
                <div className='flex flex-row items-center justify-between rounded-2xl border p-3 shadow-sm'>
                    <p className='text-sm font-semibold'>
                        2FA Enabled
                    </p>
                    <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
                        {session?.user?.isTwoFactorEnabled ? "Yes" : "No"}
                    </p>
                </div>
                {JSON.stringify(session)}
            </CardContent>
        </Card>
    )
}

export default page