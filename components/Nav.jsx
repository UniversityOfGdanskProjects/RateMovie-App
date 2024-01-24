"use client";

import Link from "next/link";
import Image from "next/image";
import { TbSearch, TbUser, TbBell } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import { NotificationsContext } from "@/context/notificationsProvider";

export default function Nav() {
  const { user, setUser } = useContext(UserContext);
  const { notifications } = useContext(NotificationsContext);

  return (
    <nav className="flex justify-between py-2 px-2 shadow-2xl">
      <Link href="/" className="flex gap-2 flex-center items-center">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <h1 className="logo_text">RateMovie</h1>
      </Link>
      <div className="flex gap-4 flex-center items-center">
        {!user && (
          <>
            <Link href="/login">
              <button className="small-btn">Sign In</button>
            </Link>
            <Link href="/admin-sign-in">
              <button className="small-btn">Sign In As Admin</button>
            </Link>
          </>
        )}
        <Link href="/search">
          <button className="big-btn py-1 px-3 flex flex-center items-center gap-2">
            <p>Search</p>
            <TbSearch />
          </button>
        </Link>
        <Link href="/ranking/movies">
          <button className="small-btn">Movies Ranking</button>
        </Link>
        <Link href="/ranking/users">
          <button className="small-btn">Users Ranking</button>
        </Link>
        {user && (
          <Link href="/profile" className="flex gap-2 flex-center items-center">
            <button className="small-btn">
              <p className="">Profile</p>
              <TbUser className="text-xl" />
            </button>
          </Link>
        )}
        {user && (
          <Link
            href="/profile/followed"
            className="flex gap-2 flex-center items-center"
          >
            <button className="small-btn">
              <TbBell className="text-2xl" />
              {notifications && (
                <div className="text-sm">{notifications.length}</div>
              )}
            </button>
          </Link>
        )}
        {user && (
          <Link href="/">
            <button className="small-btn" onClick={() => setUser(null)}>
              Sign Out
            </button>
          </Link>
        )}
        {user && user.isAdmin && (
          <Link href="/admin/manage-users">
            <button className="small-btn">Admin Panel</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
