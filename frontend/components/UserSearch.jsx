"use client";
import React, { useState, useContext } from "react";
import { UserContext } from "@/context/userContextProvider";

const UserSearch = ({ onUserSelect }) => {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [msg, setMsg] = useState("");

  const handleSearch = async () => {
    // console.log(user.token);
    setMsg("searching...");
    try {
      console.log(user.token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}admin/getUsers?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.users);
        if (data.users.length !== 0) {
          setSearchResults(data.users);
          setMsg("Users found");
        } else {
          setMsg("User not found");
        }
      } else if (response.status === 404) {
        setSearchResults([]);
        setMsg("User not found");
      } else {
        setMsg("Error fetching users");
      }
    } catch (error) {
      setMsg("Error fetching users", error);
    }
  };

  return (
    <div className="m-auto sm:w-full md:w-full lg:w-3/4 xl:w-2/3">
      {msg && <p className="msg">{msg}</p>}
      <div className="form w-full">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button className="small-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="my-4">
          <h2>Select from Search Results:</h2>
          <ul>
            {searchResults.map((user) => (
              <li
                className="p-2 my-1 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
                key={user.id}
                onClick={() => onUserSelect(user)}
              >
                <p>username: {user.username}</p>
                <p>email: {user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
