'use client'

import Image from 'next/image'
import MovieList from '@/components/MovieList'
import { useState, useEffect } from 'react'
import { config } from 'dotenv'
config()

// const BASE_URL = process.env.BASE_URL
const BASE_URL = 'http://localhost:3000/api'

const PopularMovies = () => {
  const [ movies, setMovies ] = useState([])

  useEffect(() => {
    console.log(BASE_URL)
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movies/popular`)
        if (response.ok) {
          const data = await response.json()
          setMovies(data)
        } else {
          console.error('Failed to fetch popular movies')
        }
      } catch (error) {
        console.error('Error fetching popular movies:', error)
      }
    }

    fetchPopularMovies()
  }, [])

  return (
    <section className='w-full flex-center flex-col'>
      <MovieList movies={movies}/>
    </section>
  )
}

export default function App() {
  return (
    <main className="flex flex-col items-center gap-24 justify-between p-24">
      <section className='w-full flex-center flex-col'>
        <p className=''>
        Track films you’ve watched. Save those you want to see.
        </p>
      </section>
      <PopularMovies />
    </main>
  )
}
