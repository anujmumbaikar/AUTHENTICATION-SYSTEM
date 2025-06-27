"use client"
import React, { useCallback,useEffect } from 'react'
import { CardWrapper } from './CardWrapper'
import {BeatLoader} from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import FormError from '../form-error'
import FormSuccess from '../form-success'
function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const onSubmit = useCallback(async()=>{
        try {
            const response = await axios.post('/api/auth/new-verification', {
                token
            });
            if (response.status === 200) {
                setSuccess(response.data.message);
            } else {
                setError(response.data.error || 'An error occurred while verifying your email.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error || 'An error occurred while verifying your email.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    },[token])
    useEffect(()=>{
        onSubmit()
    },[onSubmit])
  return (
    <CardWrapper
    headerLabel='Confirming your email'
    backButtonHref='/auth/login'
    backButtonLabel='Back to Login'
    >
        <div className='flex items-center w-full justify-center'>
            {!error && !success && (
                <BeatLoader/>
            )}
            {error && <FormError errorMessage={error} />}
            {success && <FormSuccess successMessage={success} />}
        </div>
    </CardWrapper>
  )
}

export default NewVerificationForm