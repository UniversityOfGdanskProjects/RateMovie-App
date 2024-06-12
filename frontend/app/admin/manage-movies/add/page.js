"use client"
import React from 'react'
import AddMovieForm from '@/components/addMovieForm'

export default function addMovie() {
  return (
    <section>
      <h1 className='msg'>Add Custom Movie</h1>
      <AddMovieForm/>
    </section>
  )
}
