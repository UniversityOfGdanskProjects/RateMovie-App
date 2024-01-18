"use client"
import React, {useContext} from 'react'
import AddMovieForm from '@/components/addMovieForm'
import { UserContext } from '@/context/userContextProvider'

export default function addMovie() {
  const {user} = useContext(UserContext)
  console.log("sssss", user)
  return (
    <section>
      <h1 className='msg'>Add Custom Movie</h1>
      <AddMovieForm user={user}/>
      <br/>
    </section>
  )
}
