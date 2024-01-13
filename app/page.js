'use client'

import Image from 'next/image'
import Link from 'next/link'
import MovieList from '@/components/MovieList'
import { useState, useEffect } from 'react'
import { config } from 'dotenv'
config()

// const BASE_URL = process.env.BASE_URL
const BASE_URL = 'http://localhost:7000/api'

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
    <main className="flex flex-col items-center gap-24 justify-between">
      <section className=''>
        <p className=''>
        Track films you’ve watched. Save those you want to see.
        </p>
        <Link href='/register' className='my-2'>
        <button className='big-btn'>
          GET STARTED - IT'S FREE
        </button>
        </Link>
        <PopularMovies />
      </section>
    </main>
  )
}
