"use client";
import React from "react";
import Link from "next/link";

export default function ManageMoviesLayout({ children }) {
  return (
    <>
      <section>
        <nav className="sub-nav">
          <Link href="/admin/manage-movies/add-from-tmdb">
            <button className="small-btn">Add Movie From Tmdb</button>
          </Link>
          <Link href="/admin/manage-movies/add">
            <button className="small-btn">Add Custom Movie</button>
          </Link>
          <Link href="/admin/manage-movies/edit-delete">
            <button className="small-btn">Edit/Delete Movie</button>
          </Link>
          <Link href="/admin/manage-movies/list-directors">
            <button className="small-btn">Directors List</button>
          </Link>
          <Link href="/admin/manage-movies/list-actors">
            <button className="small-btn">Actors List</button>
          </Link>
          <Link href="/admin/manage-movies/list-genres">
            <button className="small-btn">Genres List</button>
          </Link>
        </nav>
      </section>
      {children}
    </>
  );
}
