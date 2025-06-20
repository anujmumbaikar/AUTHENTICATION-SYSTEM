import React from 'react'
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

interface FormErrorProps {
    errorMessage?: string;
}

function FormError({ errorMessage }: FormErrorProps) {
    if (!errorMessage) {
        return null;
    }
  return (
    <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
        <ExclamationTriangleIcon className='w-4 h-4' />
        <p>{errorMessage}</p>
    </div>
  )
}

export default FormError