import React from 'react'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <section>
        <LoginForm />
        <p className=''>
        Doesn't have an account? Register down below!
        </p>
        <Link href='/register' className='my-2'>
        <button className='big-btn'>
          REGISTER
        </button>
        </Link>

    </section>
  )
}
