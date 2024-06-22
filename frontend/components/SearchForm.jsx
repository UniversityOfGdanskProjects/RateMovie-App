"use client";

const SearchForm = ({ searchQuery, setSearchQuery, genres, handleSearch }) => {
  return (
    <div className="form-better">
      <div className="fields">
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            value={searchQuery.title}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, title: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label>Actor / Director</label>
          <input
            type="text"
            value={searchQuery.name}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, name: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label>Genre</label>
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
        </div>
        <div className="field">
          <label>Rating</label>
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
        </div>
        <div className="field">
          <label>Year</label>
          <input
            type="text"
            value={searchQuery.year}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, year: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label>Sort By</label>
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
        </div>
        <div className="field">
          <label>Sort Order</label>
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
        </div>
      </div>
      <div className="buttons">
        <button className="big-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
