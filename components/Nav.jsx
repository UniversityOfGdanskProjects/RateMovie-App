'use client'

import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";

export default function Nav() {
  const { user, setUser } = useContext(UserContext)

  return (
    <nav className='flex bg-slate-800 justify-between py-2 px-2 shadow-2xl'>
      <Link href='/' className='flex gap-2 flex-center items-center'>
        <Image
          src='/assets/images/logo.svg'
          alt='logo'
          width={50}
          height={50}
          className='object-contain'
        />
        <h1 className='logo_text'>RateMovie</h1>
      </Link>
      <div className="flex gap-4 flex-center items-center">
        { !user &&
        <Link href='/login'>
          <button className="small-btn">
            Sign In
          </button>
        </Link>
        }

        { user && 
        <Link href='/profile' className='flex gap-2 flex-center items-center'>
          <Image
            src='/assets/images/profile.svg'
            width={30}
            height={30}
            className='rounded-full'
            alt='profile'
          />
          <p className=''>Profile</p>
        </Link >
        }
        { user &&
        <Link href='/'>
          <button className='small-btn' onClick={()=>setUser(null)}>
            Sign Out
          </button>
        </Link>
        }
      </div>
    </nav>
  )
}
