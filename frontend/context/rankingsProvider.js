"use client";
import { createContext, useState, useEffect } from "react";

export const RankingContext = createContext();

export const RankingContextProvider = ({ children }) => {
  const [rankedMovies, setRankedMovies] = useState([]);
  const [rankedUsers, setRankedUsers] = useState([]);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const fetchMovies = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}ranking/movies`
      );
      const data = await response.json();
      if (response.ok) setRankedMovies(data);
    };

    const fetchUsers = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}ranking/users`
      );
      const data = await response.json();
      if (response.ok) setRankedUsers(data);
    };

    fetchMovies();
    fetchUsers();
  }, []);
  return (
    <RankingContext.Provider value={{ rankedMovies, rankedUsers }}>
      {children}
    </RankingContext.Provider>
  );
};
