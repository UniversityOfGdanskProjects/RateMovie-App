"use client";
import React, { useContext, useLayoutEffect, useState } from "react";
import { UserContext } from "@/context/userContextProvider";
import { NotificationsContext } from "@/context/notificationsProvider";
import MovieList from "@/components/MovieList";
import NotificationsPanel from "@/components/NotificationsPanel";

export default function FollowedPage() {
  const { user } = useContext(UserContext);
  const { followedMovies, notifications } = useContext(NotificationsContext);

  return (
    <section className="p-3">
      <NotificationsPanel
        notifications={notifications}
        followedMovies={followedMovies}
      />
      <div className="p-3 rounded-lg border-2 border-slate-700 border-solid">
        <h1>Followed Movies</h1>
        {followedMovies.length !== 0 && (
          <p>You are following {followedMovies.length} movies</p>
        )}
        {followedMovies && (
          <MovieList movies={followedMovies} isPersonal={true} />
        )}
      </div>
    </section>
  );
}
