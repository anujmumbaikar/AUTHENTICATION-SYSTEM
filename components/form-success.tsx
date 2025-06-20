import React from 'react'
import {CheckCircledIcon} from "@radix-ui/react-icons";

interface FormSuccessProps {
    successMessage?: string;
}

function FormSuccess({ successMessage }: FormSuccessProps) {
    if (!successMessage) {
        return null;
    }
  return (
    <div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500'>
        <CheckCircledIcon className='w-4 h-4' />
        <p>{successMessage}</p>
    </div>
  )
}

export default FormSuccess