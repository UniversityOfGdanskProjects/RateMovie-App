"use client";
import React from "react";

const SearchForm = ({ searchQuery, setSearchQuery, genres, handleSearch }) => {
  return (
    <div className="form">
      <label>
        Title:
        <input
          type="text"
          value={searchQuery.title}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, title: e.target.value })
          }
        />
      </label>
      <label>
        Actor's/Director's Name:
        <input
          type="text"
          value={searchQuery.name}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, name: e.target.value })
          }
        />
      </label>
      <label>
        Genre:
        <select
          value={searchQuery.genre}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, genre: e.target.value })
          }
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Rating:
        <select
          value={searchQuery.rating}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, rating: e.target.value })
          }
        >
          <option value="">All Ratings</option>
          <option value="0">0-1</option>
          <option value="1">1-2</option>
          <option value="2">2-3</option>
          <option value="3">3-4</option>
          <option value="4">4-5</option>
        </select>
      </label>
      <label>
        Year:
        <input
          type="text"
          value={searchQuery.year}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, year: e.target.value })
          }
        />
      </label>
      <label>
        Sort By:
        <select
          value={searchQuery.sortBy}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, sortBy: e.target.value })
          }
        >
          <option value="">Select</option>
          <option value="title">Title</option>
          <option value="original_title">Original Title</option>
          <option value="release_date">Release Date</option>
          <option value="rating_count">Rating Count</option>
          <option value="rating_avg">Rating Average</option>
          <option value="runtime">Runtime</option>
        </select>
      </label>
      <label>
        Sort Order:
        <select
          value={searchQuery.sortOrder}
          onChange={(e) =>
            setSearchQuery({ ...searchQuery, sortOrder: e.target.value })
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
          <option value="">None</option>
        </select>
      </label>
      <div className="buttons">
        <button className="big-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
