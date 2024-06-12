"use client";
import AddTMDBMovieForm from "@/components/AddTMDBMovieForm";

export default function AddTMDBMovie() {
  return (
    <section>
      <h1 className="msg">Add Movie From TMDB</h1>
      <AddTMDBMovieForm />
      <br />
    </section>
  );
}
