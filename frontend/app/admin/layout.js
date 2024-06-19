"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "@/context/userContextProvider";
import { useRouter } from "next/navigation";

export default function ProfileLayout({ children }) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.roles.includes("admin")) {
      router.push("/");
    }
  });

  return (
    <>
      {user && user.roles.includes("admin") ? (
        <>
          <section>
            <nav className="bg-slate-700 flex flex-wrap p-2 gap-2 justify-center">
              <Link href="/admin/manage-users">
                <button className="big-btn">Users</button>
              </Link>
              <Link href="/admin/manage-movies/add-from-tmdb">
                <button className="big-btn">Movies</button>
              </Link>
            </nav>
          </section>
          {children}
        </>
      ) : (
        <section className="p-2">
          <h1 className="p-2 font-bold">Access Denied</h1>
          <p className="p-2">
            You do not have the required permissions to view this page.
          </p>
          <p className="p-2">Redirecting to Home Page...</p>
        </section>
      )}
    </>
  );
}
