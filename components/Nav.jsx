'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Nav() {
  return (
    <nav className='flex bg-slate-300 justify-between py-1 px-2'>
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
      <div className="flex gap-4">
      <Link href='/profile' className='flex gap-2 flex-center items-center'>
        <Image
          src='/assets/images/profile.svg'
          width={30}
          height={30}
          className='rounded-full'
          alt='profile'
        />
        <p className=''>My lists</p>
      </Link>
      <Link href='/profile' className='flex gap-2 flex-center items-center'>
        <Image
          src='/assets/images/profile.svg'
          width={30}
          height={30}
          className='rounded-full'
          alt='profile'
        />
        <p className=''>Profile</p>
      </Link>
      </div>
    </nav>
  )
}
