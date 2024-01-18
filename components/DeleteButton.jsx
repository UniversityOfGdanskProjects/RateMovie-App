'use client'
import React, {useState, useContext} from 'react'
import { UserContext } from '@/context/userContextProvider'

export default function DeleteButton({movieId}) {
    const {user} = useContext(UserContext)
    const [msg, setMsg] = useState('')

    const handleDelete = () => {
        console.log(user)
        const deleteMovie = async () => {
            setMsg("deleting...")
            try {
                const response = await fetch(`http://localhost:7000/api/deleteMovie`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({movieId})
                })

                console.log(response)

                if (!response.ok) {
                    const data = await response.json()
                    setMsg(data.error)
                } else {
                    setMsg("deleted succesfully")
                }
            } catch(error) {
                setMsg(error.message || 'Internal Server Error')
            }
        }
        deleteMovie()

    }

    
  return (
    <>
    <button className='big-btn' onClick={() => {handleDelete()}}>Delete</button>
    <p className='msg'>{msg}</p>
    </>
  )
}
