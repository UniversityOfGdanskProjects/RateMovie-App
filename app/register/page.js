import React from 'react'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <section className='p-3'>
      <h1 className='msg'>Add New User</h1>
      <RegisterForm isForAdmin={false}/>
    </section>
  )
}
