"use client"
import React, { useState, useEffect } from "react";

export default function ActorsList() {
  const [actors, setActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/actors/${currentPage}`);
        const data = await response.json();
        setActors(data);
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));
  };

  return (
    <section>
      <h1 className="msg">Actors List</h1>
      <section className="text-center">
      <div className="flex gap-2">
        <button className="small-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button className="small-btn" onClick={handleNextPage} disabled={actors.length < 200}>
          Next
        </button>
      </div>
        {actors.map((actor) => (
          <div
            className="bg-slate-700 m-2 p-2 rounded-lg"
            key={actor.id}
          >{`${actor.name}, ID: ${actor.id}`}</div>
        ))}
              <div className="flex gap-2">
        <button className="small-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button className="small-btn" onClick={handleNextPage} disabled={actors.length < 200}>
          Next
        </button>
      </div>
      </section>
    </section>
  );
}
