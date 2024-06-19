import bcrypt from "bcrypt";
import driver from "../../db/neo4jDriver.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import qs from "qs";

import getKeycloakAdminToken from "../../middleware/getKeycloakAdminToken.js";

import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidateCommentReview,
} from "../../helpers/validation.js";
// import { authenticateAdmin, generateToken } from "../../middleware/auth.js";
import { checkNodeExistence } from "../../helpers/checkExistence.js";
// import {
//   removeMovieFromAction,
//   addMovieToAction,
// } from "../../helpers/movieHelpers.js";
import { registerUser } from "./usersController.js";
import { commentMovie } from "./userDataController.js";
import { config } from "dotenv";
config();

const { TMDB_API_KEY } = process.env;

export const getUserById = async (req, res) => {
  const { userId } = req.query;

  try {
    const token = await getKeycloakAdminToken();
    console.log("tu token", token);
    const url = `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data;
    console.log(user);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// export const getUserById = async (req, res) => {
//   const { userId } = req.query;
//   // authenticateAdmin(req, res, async () => {
//   const session = driver.session();

//   try {
//     const result = await session.executeRead(async (tx) => {
//       const queryResult = await tx.run(
//         "MATCH (user:User {userId: $userId}) RETURN user",
//         { userId }
//       );

//       const user = queryResult.records[0]?.get("user").properties;
//       return user;
//     });

//     if (result) {
//       res.status(200).json({ user: result });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await session.close();
//   }
//   // });
// };

export const deleteUser = async (req, res) => {
  const { userId } = req.query;

  // authenticateAdmin(req, res, async () => {
  const session = driver.session();

  try {
    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );

    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await session.run(
      "MATCH (user:User {userId: $userId}) DETACH DELETE user",
      { userId }
    );

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
  // });
};

export const editUser = async (req, res) => {
  const { userId, username, email, password } = req.body;

  // authenticateAdmin(req, res, async () => {
  const session = driver.session();

  try {
    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );

    if (!userExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const queryParams = { userId };
    const setClauses = [];

    if (username && isValidUsername(username)) {
      setClauses.push("user.username = $newUsername");
      queryParams["newUsername"] = username;
    }
    if (email && isValidEmail(email)) {
      setClauses.push("user.email = $newEmail");
      queryParams["newEmail"] = email;
    }
    if (password && isValidPassword(password)) {
      setClauses.push("user.password = $newPassword");
      const hashedPassword = await bcrypt.hash(password, 10);
      queryParams["newPassword"] = hashedPassword;
    }

    const query = `
                MATCH (user:User {userId: $userId})
                SET ${setClauses.join(", ")}
                RETURN user
            `;

    const result = await session.run(query, queryParams);

    const updatedUser = result.records[0].get("user").properties;

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
  // });
};

// export const addUser = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     registerUser(req, res);
//   });
// };

// export const addMovieToFavourites = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await addMovieToAction(req, res, "FAVOURITES");
//   });
// };

// export const addMovieToIgnored = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await addMovieToAction(req, res, "IGNORES");
//   });
// };

// export const addMovieToWatchlist = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await addMovieToAction(req, res, "ADDED_TO_WATCHLIST");
//   });
// };

// export const addMovieToFollowed = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await addMovieToAction(req, res, "FOLLOWED");
//   });
// };

// export const removeMovieFromFavourites = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await removeMovieFromAction(req, res, "FAVOURITES");
//   });
// };

// export const removeMovieFromIgnored = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await removeMovieFromAction(req, res, "IGNORES");
//   });
// };

// export const removeMovieFromWatchlist = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await removeMovieFromAction(req, res, "ADDED_TO_WATCHLIST");
//   });
// };

// export const removeMovieFromFollowed = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await removeMovieFromAction(req, res, "FOLLOWED");
//   });
// };

export const addComment = async (req, res) => {
  // await authenticateAdmin(req, res, async () => {
  await commentMovie(req, res);
  // });
};

export const removeComment = async (req, res) => {
  const { commentId } = req.body;
  const session = driver.session();

  // await authenticateAdmin(req, res, async () => {
  try {
    const query = `
                MATCH ()-[r:COMMENTED]->()
                WHERE r.commentId = $commentId
                DELETE r
            `;

    await session.executeWrite((tx) => tx.run(query, { commentId }));
    res.json({ message: "Comment removed successfully" });
  } finally {
    await session.close();
  }
  // });
};

export const editComment = async (req, res) => {
  const session = driver.session();
  const { commentId, newComment } = req.body;
  // await authenticateAdmin(req, res, async () => {
  try {
    if (!isValidateCommentReview(newComment)) {
      res.status(400).json({
        error:
          "Invalid comment. Please provide a comment with a maximum length of 200 characters.",
      });
      return;
    }

    const query = `
                MATCH (u:User)-[c:COMMENTED]->(m: Movie)
                WHERE c.commentId = $commentId
                SET c.comment = $newComment
                RETURN c
            `;

    const result = await session.executeWrite((tx) =>
      tx.run(query, {
        commentId,
        newComment,
      })
    );

    const updatedComment = result.records[0].get("c").properties;
    res.json({ updatedComment });
  } finally {
    await session.close();
  }
  // });
};

// export const addReview = async (req, res) => {
//   await authenticateAdmin(req, res, async () => {
//     await rateMovie(req, res);
//   });
// };

// export const removeReview = async (req, res) => {
//   const { reviewId } = req.body;
//   const session = driver.session();

//   await authenticateAdmin(req, res, async () => {
//     try {
//       const query = `
//                 MATCH ()-[r:REVIEWED]->()
//                 WHERE ID(r) = $reviewId
//                 DELETE r
//             `;

//       await session.executeWrite((tx) => tx.run(query, { reviewId }));
//       res.json({ message: "Review removed successfully" });
//     } finally {
//       await session.close();
//     }
//   });
// };

// export const editReview = async (req, res) => {
//   const session = driver.session();
//   const { reviewId, newRating, newReview } = req.body;

//   await authenticateAdmin(req, res, async () => {
//     try {
//       if (!isValidReview(newReview)) {
//         res.status(400).json({
//           error:
//             "Invalid review. Please provide a review with a maximum length of 200 characters.",
//         });
//         return;
//       }

//       const query = `
//                 MATCH ()-[r:REVIEWED]->()
//                 WHERE ID(r) = $reviewId
//                 SET r.rating = $newRating, r.review = $newReview
//                 RETURN r
//             `;

//       const result = await session.executeWrite((tx) =>
//         tx.run(query, {
//           reviewId,
//           newRating,
//           newReview,
//         })
//       );

//       const updatedReview = result.records[0].get("r").properties;
//       res.json({ updatedReview });
//     } finally {
//       await session.close();
//     }
//   });
// };

export const addMovie = async (req, res) => {
  const session = driver.session();

  // await authenticateAdmin(req, res, async () => {
  try {
    const {
      trailers,
      images,
      runtime,
      budget,
      tagline,
      poster_path,
      release_date,
      overview,
      original_language,
      original_title,
      title,
      backdrop_path,
      genres,
      directors,
      actors,
    } = req.body;

    const movieQuery = `
                CREATE (m:Movie {
                    trailers: $trailers,
                    images: $images,
                    runtime: $runtime,
                    budget: $budget,
                    tagline: $tagline,
                    id: $id,
                    poster_path: $poster_path,
                    release_date: $release_date,
                    overview: $overview,
                    original_language: $original_language,
                    original_title: $original_title,
                    title: $title,
                    backdrop_path: $backdrop_path
                })
                RETURN m
            `;
    const newId = uuidv4();

    const movieResult = await session.executeWrite((tx) =>
      tx.run(movieQuery, {
        trailers,
        images,
        runtime,
        budget,
        tagline,
        id: newId,
        poster_path,
        release_date,
        overview,
        original_language,
        original_title,
        title,
        backdrop_path,
      })
    );

    const movieNode = movieResult.records[0].get("m");

    for (const name of genres) {
      const genreQuery = `
                    MATCH (g:Genre)
                    MATCH (m:Movie)
                    WHERE g.name = $name AND m.id = $movieId
                    CREATE (m)-[:IN_GENRE]->(g)
                `;

      await session.executeWrite((tx) =>
        tx.run(genreQuery, { name, movieId: newId })
      );
    }

    for (const director of directors) {
      const directorQuery = `
                    MATCH (d:Person:Director)
                    MATCH (m:Movie)
                    WHERE d.id = $director AND m.id = $movieId
                    CREATE (m)<-[:DIRECTED]-(d)
                `;

      await session.executeWrite((tx) =>
        tx.run(directorQuery, { director, movieId: newId })
      );
    }

    for (const actor of actors) {
      const actorQuery = `
                    MATCH (a:Person:Actor)
                    MATCH (m:Movie)
                    WHERE a.id = $actor.id AND m.id = $movieId
                    CREATE (m)<-[:ACTED_IN { character: $actor.character }]-(a)
                `;

      await session.executeWrite((tx) =>
        tx.run(actorQuery, { actor, movieId: newId })
      );
    }

    res.status(201).json({
      message: "Movie added successfully",
      movie: movieNode.properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
  // });
};

export const removeMovie = async (req, res) => {
  const { movieId } = req.body;

  // await authenticateAdmin(req, res, async () => {
  const session = driver.session();

  try {
    const movieExists = await checkNodeExistence(
      session,
      "Movie",
      "id",
      movieId
    );
    if (!movieExists) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    const query = `
                MATCH (m:Movie {id: $movieId})
                DETACH DELETE m
            `;

    await session.executeWrite((tx) => tx.run(query, { movieId }));

    res.status(200).json({ message: "Movie removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
  // });
};

export const editMovie = async (req, res) => {
  const session = driver.session();
  console.log("będziemy edytwoać");

  // await authenticateAdmin(req, res, async () => {
  try {
    const { id } = req.query;
    const {
      trailers,
      images,
      runtime,
      budget,
      tagline,
      poster_path,
      release_date,
      overview,
      original_language,
      original_title,
      title,
      backdrop_path,
      genres,
      directors,
      actors,
    } = req.body;

    const movieExists = await checkNodeExistence(session, "Movie", "id", id);

    if (!movieExists) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const setClauses = [
      trailers && "m.trailers = $trailers",
      images && "m.images = $images",
      runtime && "m.runtime = $runtime",
      budget && "m.budget = $budget",
      tagline && "m.tagline = $tagline",
      poster_path && "m.poster_path = $poster_path",
      release_date && "m.release_date = $release_date",
      overview && "m.overview = $overview",
      original_language && "m.original_language = $original_language",
      original_title && "m.original_title = $original_title",
      title && "m.title = $title",
      backdrop_path && "m.backdrop_path = $backdrop_path",
    ]
      .filter(Boolean)
      .join(", ");

    const editMovieQuery = `
                MATCH (m:Movie {id: $id})
                SET ${setClauses}
                RETURN m
            `;

    const editMovieResult = await session.executeWrite((tx) =>
      tx.run(editMovieQuery, {
        id,
        trailers,
        images,
        runtime,
        budget,
        tagline,
        poster_path,
        release_date,
        overview,
        original_language,
        original_title,
        title,
        backdrop_path,
      })
    );

    const editedMovieNode = editMovieResult.records[0].get("m");
    if (genres) {
      const deleteGenresQuery = `
                MATCH (m:Movie {id: $id})-[r:IN_GENRE]->()
                DELETE r
            `;

      await session.executeWrite((tx) => tx.run(deleteGenresQuery, { id }));

      for (const name of genres) {
        const addGenreQuery = `
                    MATCH (m: Movie)
                    MATCH (g:Genre)
                    WHERE g.name = $name AND m.id = $movieId
                    CREATE (m)-[:IN_GENRE]->(g)
                `;

        await session.executeWrite((tx) =>
          tx.run(addGenreQuery, { name, movieId: id })
        );
      }
    }

    if (directors) {
      const deleteDirectorsQuery = `
                MATCH (m:Movie {id: $id})-[r:DIRECTED]->()
                DELETE r
            `;

      await session.executeWrite((tx) => tx.run(deleteDirectorsQuery, { id }));
      for (const director of directors) {
        const addDirectorQuery = `
                    MATCH (m: Movie)
                    MATCH (d:Person:Director)
                    WHERE d.id = $directorId AND m.id = $movieId
                    CREATE (m)-[:DIRECTED]->(d)
                `;

        await session.executeWrite((tx) =>
          tx.run(addDirectorQuery, { directorId: director, movieId: id })
        );
      }
    }

    if (actors) {
      const deleteActorsQuery = `
                    MATCH (m:Movie {id: $id})<-[r:ACTED_IN]->()
                    DELETE r
                `;

      await session.executeWrite((tx) => tx.run(deleteActorsQuery, { id }));

      for (const actor of actors) {
        const addActorQuery = `
                        MATCH (m: Movie)
                        MATCH (a:Person:Actor)
                        WHERE a.id = $actorId AND m.id = $movieId
                        CREATE (m)<-[:ACTED_IN { character: $character }]-(a)
                    `;

        await session.executeWrite((tx) =>
          tx.run(addActorQuery, {
            actorId: actor.id,
            character: actor.character,
            movieId: id,
          })
        );
      }
    }
    // console.log(editedMovieNode.properties);
    res.status(200).json({
      message: "Movie edited successfully",
      movie: editedMovieNode.properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
  // });
};

export const addMovieFromTMDB = async (req, res) => {
  const session = driver.session();
  try {
    const { movieId } = req.body;
    console.log(movieId);

    if (!movieId) {
      res.status(400).json({ error: "movieId is required" });
      return;
    }

    const movieExists = await checkNodeExistence(
      session,
      "Movie",
      "id",
      movieId
    );

    if (movieExists) {
      res.status(400).json({ error: "Movie with the given id already exists" });
      return;
    }

    const tmdbUrlQuery = `CALL apoc.load.json('https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images') YIELD value RETURN value`;
    const tmdbResponse1 = await session.run(tmdbUrlQuery);
    const tmdbResponse = tmdbResponse1.records[0].get("value");

    const result = await session.executeWrite((tx) => {
      const addMovieQuery = `
                MERGE (m:Movie {id: $id})
                ON CREATE SET
                    m.overview = $overview,
                    m.original_language = $original_language,
                    m.original_title = $original_title,
                    m.runtime = $runtime,
                    m.title = $title,
                    m.poster_path = $poster_path,
                    m.backdrop_path = $backdrop_path,
                    m.release_date = $release_date,
                    m.tagline = $tagline,
                    m.budget = $budget,
                    m.images = $images,
                    m.trailers = $trailers
                RETURN m
            `;

      const addMovieParams = {
        id: tmdbResponse.id.toString(),
        overview: tmdbResponse.overview,
        original_language: tmdbResponse.original_language,
        original_title: tmdbResponse.original_title,
        runtime: tmdbResponse.runtime,
        title: tmdbResponse.title,
        poster_path:
          "https://image.tmdb.org/t/p/original" + tmdbResponse.poster_path,
        backdrop_path:
          "https://image.tmdb.org/t/p/original" + tmdbResponse.backdrop_path,
        release_date: tmdbResponse.release_date,
        tagline: tmdbResponse.tagline,
        budget: tmdbResponse.budget,
        images: tmdbResponse.images.backdrops.map(
          (backdrop) =>
            "https://image.tmdb.org/t/p/original" + backdrop.file_path
        ),
        trailers: tmdbResponse.videos.results
          .filter(
            (video) => video.site === "YouTube" && video.type === "Trailer"
          )
          .map((video) => video.key),
      };
      return tx.run(addMovieQuery, addMovieParams);
    });
    for (const genreId of tmdbResponse.genres.map((genre) =>
      genre.id.toString()
    )) {
      const addGenreRelationQuery = `
                MATCH (m:Movie {id: $movieId})
                MATCH (g:Genre {id: $genreId})
                MERGE (m)-[:IN_GENRE]->(g)
            `;

      const addGenreRelationParams = {
        movieId: tmdbResponse.id.toString(),
        genreId: genreId.toString(),
      };

      await session.executeWrite((tx) =>
        tx.run(addGenreRelationQuery, addGenreRelationParams)
      );
    }

    for (const director of tmdbResponse.credits.crew) {
      if (director.job === "Director") {
        const addDirectorQuery = `
                    MERGE (p:Person:Director {id: $id})
                    ON CREATE SET p.name = $name, p.profile_path = $profile_path
                    MERGE (m:Movie {id: $movieId})
                    MERGE (m)<-[:DIRECTED]-(p)
                `;

        const addDirectorParams = {
          id: director.id.toString(),
          name: director.name,
          profile_path: director.profile_path
            ? "https://image.tmdb.org/t/p/original" + director.profile_path
            : "",
          movieId: tmdbResponse.id.toString(),
        };

        await session.executeWrite((tx) =>
          tx.run(addDirectorQuery, addDirectorParams)
        );
      }
    }
    for (const actorData of tmdbResponse.credits.cast.slice(0, 15)) {
      const addActorQuery = `
                MERGE (a:Person:Actor {id: $id})
                ON CREATE SET a.name = $name, a.profile_path = $profile_path
                MERGE (m:Movie {id: $movieId})
                MERGE (m)<-[:ACTED_IN { character: $character }]-(a)
            `;

      const addActorParams = {
        id: actorData.id.toString(),
        name: actorData.name,
        profile_path: actorData.profile_path
          ? "https://image.tmdb.org/t/p/original" + actorData.profile_path
          : "",
        movieId: tmdbResponse.id.toString(),
        character: actorData.character,
      };

      await session.executeWrite((tx) => tx.run(addActorQuery, addActorParams));
    }

    res.status(201).json({
      message: "Movie added successfully",
      movie: result.records[0].get("m").properties,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
