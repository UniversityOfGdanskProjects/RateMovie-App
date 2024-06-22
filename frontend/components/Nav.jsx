"use client";

import Link from "next/link";
import Image from "next/image";
import { TbSearch, TbUser } from "react-icons/tb";
import { useContext } from "react";
import { UserContext } from "@/context/userContextProvider";

export default function Nav() {
  const { user, setUser, keycloak } = useContext(UserContext);
  const handleLogout = () => {
    setUser(null);
    if (keycloak) {
      console.log("wylogowujemy sb");
      keycloak.logout();
    }
  };

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
          <Link href="/login">
            <button className="small-btn">Sign In</button>
          </Link>
        )}
        <Link href="/search">
          <button className="big-btn py-1 px-3 flex flex-center items-center gap-2">
            <p>Search</p>
            <TbSearch />
          </button>
        </Link>
        <Link href="/ranking">
          <button className="small-btn">Ranking</button>
        </Link>
        {user && (
          <Link
            href="/profile/reviewed"
            className="flex gap-2 flex-center items-center"
          >
            <button className="small-btn">
              <p className="">Profile</p>
              <TbUser className="text-xl" />
            </button>
          </Link>
        )}
        {user && (
          <button className="small-btn" onClick={handleLogout}>
            Sign Out
          </button>
        )}
        {user && user.roles && user.roles.includes("admin") && (
          <Link href="/admin/manage-users">
            <button className="small-btn">Admin Panel</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
