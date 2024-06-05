"use client";
import React, { useState, useEffect } from "react";

export default function DirectorsList() {
  const [directors, setDirectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/directors/${currentPage}`);
        const data = await response.json();
        setDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
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
      <h1 className="msg">Directors List</h1>
      <section className="text-center">
        <div className="flex gap-2">
          <button className="small-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button className="small-btn" onClick={handleNextPage} disabled={directors.length < 200}>
            Next
          </button>
        </div>
        {directors.map((director) => (
          <div
            className="bg-slate-700 m-2 p-2 rounded-lg"
            key={director.id}
          >{`${director.name}, ID: ${director.id}`}</div>
        ))}
        <div className="flex gap-2">
          <button className="small-btn" onClick={handlePrevPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button className="small-btn" onClick={handleNextPage} disabled={directors.length < 200}>
            Next
          </button>
        </div>
      </section>
    </section>
  );
}

