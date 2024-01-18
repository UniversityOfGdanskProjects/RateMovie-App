'use client'
import React, {useContext, useEffect} from 'react';
import Link from 'next/link';
import { UserContext } from '@/context/userContextProvider';
import { useRouter } from 'next/navigation';

export default function ProfileLayout({ children }) {
    const {user} = useContext(UserContext)

    const router = useRouter();
    useEffect(() => {
        if (!user || !user.isAdmin) {
            router.push('/admin-sign-in');
            return;
          }
    })

    return (
        <>
        { user && user.isAdmin &&
                <>
                <section>
                <nav className='bg-slate-700 flex flex-wrap p-2 gap-2'>
                <Link href='/admin/manage-users'>
                    <button className='big-btn'>
                        Users
                    </button>
                </Link>
                <Link href='/admin/manage-movies/add-from-tmdb'>
                    <button className='big-btn'>
                        Movies
                    </button>
                </Link>
                <Link href='/admin/manage-ratings'>
                    <button className='big-btn'>
                        Ratings
                    </button>
                </Link>
                <Link href='/admin/manage-comments'>
                    <button className='big-btn'>
                        Comments
                    </button>
                </Link>
                
                </nav>
            </section>
            {children}
            </>
        }
        </>
    );
}
