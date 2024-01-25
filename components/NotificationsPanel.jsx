"use client";
import Link from "next/link";

export default function NotificationsPanel({ notifications, followedMovies }) {
  return (
    <>
      {notifications.length !== 0 && followedMovies.length !== 0 ? (
        <ul className="notifications-panel">
          <h1>Notifications ({notifications.length}):</h1>
          {notifications &&
            notifications.map((notif, index) => {
              const movie = followedMovies.find(
                (movie) => movie.id === notif.movieId
              );
              return (
                <Link
                  key={`${index}-${movie.id}-link`}
                  href={`/movie/${movie.id}`}
                >
                  <li className="notification" key={`${index}-${movie.id}`}>
                    <p>
                      New comment on a movie <span>{movie.title}:</span>
                    </p>
                    <p className="comment">{notif.comment}</p>
                    <p className="faded">{notif.time}</p>
                  </li>
                </Link>
              );
            })}
        </ul>
      ) : (
        <h2>You don't have any notifications</h2>
      )}
    </>
  );
}
