import React, {useContext} from 'react'
import { UserContext } from '@/context/userContextProvider'

import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'

export default function AdminSignIn() {
  return (
    <section className='flex flex-col gap-3 p-3'>
        <h1 className='msg'>Register As Admin</h1>
        <RegisterForm isForAdmin={true}/>
        <h1 className='msg'>Login As Admin</h1>
        <LoginForm isForAdmin={true}/>
    </section>
  )
}
