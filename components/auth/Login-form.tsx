import React from 'react'
import { CardWrapper } from './CardWrapper'
function LoginForm() {
  return (
    <CardWrapper
        headerLabel="Welcome Back"
        backButtonLabel="Don't have an account? Sign up"
        backButtonHref="/auth/register"
        showSocial
    >
        Login Form
    </CardWrapper>
  )
}

export default LoginForm