'use client'

import Image from 'next/image'
import Link from 'next/link'
import MovieList from '@/components/MovieList'
import { UserContext } from '@/context/userContextProvider'
import { useState, useEffect, useContext } from 'react'
import { config } from 'dotenv'
config()


export default function App() {
  const {user} = useContext(UserContext)
  const [ movies, setMovies ] = useState([])

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/movies/popular`)
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
    <main className="">
      <section className=''>
          <div className="backdrop-container mb-12">
            <div className='backdrop-info flex flex-col items-center'>
              <h1 className='text-center text-4xl mb-4'>
              Your movies, your ratings, your community. Immerse yourself in the world of cinema with us!
              </h1>
              { !user &&
                <Link href='/register' className='my-2'>
                  <button className='big-btn'>
                    GET STARTED - IT'S FREE
                  </button>
                </Link>
              }
            </div>
            <div className="backdrop-gradient"></div>
            <img src='https://image.tmdb.org/t/p/original/8QXGNP0Vb4nsYKub59XpAhiUSQN.jpg' alt="Backdrop" className="backdrop opacity-75" />
          </div>

        <MovieList movies={movies} isPersonal={false}/>
      </section>
    </main>
  )
}
