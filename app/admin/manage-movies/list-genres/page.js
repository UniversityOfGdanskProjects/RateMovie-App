"use client"
import React, { useState, useEffect } from 'react'

export default function GenresList() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/genres");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className='text-center'>
      <section>
      <h1 className="msg">Genres List</h1>
      <ul>
        {genres.map((genre) => (
          <li className="bg-slate-700 m-2 p-2 rounded-lg" key={genre.id}>{genre.name}, id {genre.id}</li>
        ))}
      </ul>
      </section>
    </section>
  );
}
