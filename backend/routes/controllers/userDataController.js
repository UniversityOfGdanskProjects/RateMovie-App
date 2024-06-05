import {
  getMoviesByRelation,
  getRelationByMovieAndUser,
} from "../../helpers/movieHelpers.js";
import driver from "../../db/neo4jDriver.js";
import {
  addMovieToAction,
  removeMovieFromAction,
} from "../../helpers/movieHelpers.js";
import {
  isValidRating,
  isValidateCommentReview,
} from "../../helpers/validation.js";
import {
  sendRankingUpdate,
  sendNotification,
} from "../../mqtt/mqttPublisher.js";
import { checkNodeExistence } from "../../helpers/checkExistence.js";
import { v4 as uuidv4 } from "uuid";

export const getFavouriteMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "FAVOURITES");
};

export const getWatchlistMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "ADDED_TO_WATCHLIST");
};

export const getIgnoredMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "IGNORES");
};

export const getFollowedMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "FOLLOWED");
};

export const getCommentedMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "COMMENTED");
};

export const getReviewedMovies = async (req, res) => {
  await getMoviesByRelation(req, res, "REVIEWED");
};

export const getReviewByMovieAndUser = async (req, res) => {
  await getRelationByMovieAndUser(req, res, "REVIEWED");
};

export const getFavouriteByMovieAndUser = async (req, res) => {
  await getRelationByMovieAndUser(req, res, "FAVOURITES");
};

export const getIgnoredByMovieAndUser = async (req, res) => {
  await getRelationByMovieAndUser(req, res, "IGNORES");
};

export const getFollowedByMovieAndUser = async (req, res) => {
  await getRelationByMovieAndUser(req, res, "FOLLOWED");
};

export const getWathlistByMovieAndUser = async (req, res) => {
  await getRelationByMovieAndUser(req, res, "ADDED_TO_WATCHLIST");
};

export const rateMovie = async (req, res) => {
  const movieId = req.params.movieId ? req.params.movieId : req.body.movieId;
  const { userId, rating, review, date } = req.body;
  const session = driver.session();

  const newDate = date ? date : new Date().toISOString().split("T")[0];

  try {
    if (!isValidRating(rating) || !isValidateCommentReview(review)) {
      res.status(400).json({
        error:
          "Invalid rating or review. Please provide a comment a comment with a maximum length of 200 characters and rating between 1 and 10.",
      });
      return;
    }

    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );
    const movieExists = await checkNodeExistence(
      session,
      "Movie",
      "id",
      movieId
    );

    if (!userExists || !movieExists) {
      res.status(404).json({ error: "User or movie not found" });
      return;
    }

    const isInWatchlistResult = await session.run(
      `
            MATCH (u:User {userId: $userId})-[:ADDED_TO_WATCHLIST]->(m:Movie {id: $movieId})
            RETURN COUNT(m) > 0 AS isInWatchlist
        `,
      { userId, movieId }
    );

    const isInWatchlist = isInWatchlistResult.records[0].get("isInWatchlist");

    if (isInWatchlist) {
      await session.run(
        `
                MATCH (u:User {userId: $userId})-[r:ADDED_TO_WATCHLIST]->(m:Movie {id: $movieId})
                DELETE r
            `,
        { userId, movieId }
      );
    }

    const result = await session.run(
      `
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie {id: $movieId})
            OPTIONAL MATCH (u)-[r:REVIEWED]->(m)
            WITH u, m, r
            CALL apoc.do.when( r IS NOT NULL,
                'MATCH (u:User {userId: $userId})-[r:REVIEWED]->(m:Movie {id: $movieId})
                SET r.rating = newRating, r.review = newReview, r.date = newDate
                RETURN r AS review, false AS created',

                'MATCH (u:User {userId: $userId})
                MATCH (m:Movie {id: $movieId})
                CREATE (u)-[r:REVIEWED {rating: newRating, review: newReview, date: newDate}]->(m)
                RETURN r AS review, true AS created',
                {newRating: $rating, newReview: $review, newDate: $date, userId: $userId, movieId: $movieId}
            )
            YIELD value 
            RETURN value.review AS review, value.created AS created`,
      { userId, movieId, rating, review, date: newDate }
    );

    const created = result.records[0].get("created");
    const newReview = result.records[0].get("review").properties;

    const successMessage = created
      ? "Review added successfully"
      : "Review updated successfully";
    const watchlistMessage = isInWatchlist
      ? "Movie removed from watchlist."
      : "";

    sendRankingUpdate();

    res.status(created ? 201 : 200).json({
      message: `${successMessage} ${watchlistMessage}`,
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const commentMovie = async (req, res) => {
  const movieId = req.params.movieId;
  const { userId, comment } = req.body;

  const session = driver.session();

  try {
    if (!isValidateCommentReview(comment)) {
      res.status(400).json({
        error:
          "Invalid comment. Please provide a comment with a maximum length of 200 characters.",
      });
      return;
    }

    const userExists = await checkNodeExistence(
      session,
      "User",
      "userId",
      userId
    );
    const movieExists = await checkNodeExistence(
      session,
      "Movie",
      "id",
      movieId
    );

    if (!userExists || !movieExists) {
      res.status(404).json({ error: "User or Movie not found" });
      return;
    }

    const query = `
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie {id: $movieId})
            CREATE (u)-[r:COMMENTED {commentId: $commentId, comment: $comment, date: $date}]->(m)
            RETURN r
        `;

    const result = await session.executeWrite((tx) =>
      tx.run(query, {
        userId,
        movieId,
        comment,
        commentId: uuidv4(),
        date: new Date().toISOString().split("T")[0],
      })
    );

    const createdRelationship = result.records[0].get("r").properties;
    sendNotification(movieId, comment);
    res.status(200).json(createdRelationship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.body;
  const session = driver.session();

  try {
    const result = await session.executeWrite((tx) =>
      tx.run(
        `
        MATCH (u: User)-[r: COMMENTED {commentId: $commentId}]->(m: Movie) DELETE r
        `,
        { commentId }
      )
    );

    res.status(200).json({ message: "deleted successfuly" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const editComment = async (req, res) => {
  const { commentId, comment } = req.body;
  const session = driver.session();

  try {
    const result = await session.executeWrite((tx) =>
      tx.run(
        `
        MATCH (u: User)-[r: COMMENTED {commentId: $commentId}]->(m: Movie)
        SET r.comment = $comment
        RETURN r
        `,
        { commentId, comment }
      )
    );
    const editedComment = result.records[0].get("r").properties;

    res.status(200).json({ message: "edited successfuly", editedComment });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const removeMovieFromCommented = async (req, res) => {
  await removeMovieFromAction(req, res, "COMMENTED");
};

export const removeMovieFromReviewed = async (req, res) => {
  await removeMovieFromAction(req, res, "REVIEWED");
  sendRankingUpdate();
};

export const addMovieToFavourites = async (req, res) => {
  await addMovieToAction(req, res, "FAVOURITES");
};

export const addMovieToIgnored = async (req, res) => {
  await addMovieToAction(req, res, "IGNORES");
};

export const addMovieToWatchlist = async (req, res) => {
  await addMovieToAction(req, res, "ADDED_TO_WATCHLIST");
};

export const addMovieToFollowed = async (req, res) => {
  await addMovieToAction(req, res, "FOLLOWED");
};

export const removeMovieFromFavourites = async (req, res) => {
  await removeMovieFromAction(req, res, "FAVOURITES");
};
export const removeMovieFromIgnored = async (req, res) => {
  await removeMovieFromAction(req, res, "IGNORES");
};

export const removeMovieFromWatchlist = async (req, res) => {
  await removeMovieFromAction(req, res, "ADDED_TO_WATCHLIST");
};

export const removeMovieFromFollowed = async (req, res) => {
  await removeMovieFromAction(req, res, "FOLLOWED");
};
