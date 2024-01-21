import driver from "../db/neo4jDriver.js";
import {
  checkNodeExistence,
  checkRelationshipExistence,
} from "./checkExistence.js";

export const addMovieToAction = async (req, res, actionType) => {
  const movieId = req.params.movieId ? req.params.movieId : req.body.movieId;
  const { userId } = req.body;
  const session = driver.session();

  try {
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

    const relationshipExists = await checkRelationshipExistence(
      session,
      "User",
      "userId",
      userId,
      actionType,
      "Movie",
      "id",
      movieId
    );

    if (relationshipExists) {
      res.status(400).json({ error: "Relationship already exists" });
      return;
    }

    const query = `
            MATCH (u:User {userId: $userId}) MATCH (m:Movie {id: $movieId})
            CREATE (u)-[r:${actionType}]->(m)
            RETURN r
        `;

    const result = await session.run(query, { userId, movieId });
    const createdRelationship = result.records[0].get("r").properties;
    res.status(200).json({ message: `added new relation ${actionType}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getMoviesByRelation = async (req, res, relationType) => {
  const { userId } = req.params;
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

    const query = `
            MATCH (u:User {userId: $userId})-[r:${relationType}]->(m:Movie)
            RETURN m, COLLECT(DISTINCT r) AS relationContent
        `;

    const result = await session.run(query, { userId });
    console.log(result);
    const data = result.records.map((record) => {
      const movie = record.get("m").properties;
      const relationsContent = record.get("relationContent")[0].properties;
      return { ...movie, relationsContent };
    });

    res.status(200).json({ count: data.length, movies: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const removeMovieFromAction = async (req, res, actionType) => {
  const { userId, movieId } = req.params;
  const session = driver.session();

  try {
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

    const relationshipExists = await checkRelationshipExistence(
      session,
      "User",
      "userId",
      userId,
      actionType,
      "Movie",
      "id",
      movieId
    );

    if (!relationshipExists) {
      res.status(400).json({ error: "Relationship does not exist" });
      return;
    }

    const query = `
            MATCH (u:User {userId: $userId})-[r:${actionType}]->(m:Movie {id: $movieId})
            DELETE r
        `;

    await session.run(query, { userId, movieId });

    res
      .status(200)
      .json({ message: `Removed ${actionType} relationship successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getRelationByMovieAndUser = async (req, res, relationType) => {
  const { userId, movieId } = req.params;
  const session = driver.session();

  try {
    const query = `
        MATCH (u: User {userId: $userId})-[r:${relationType}]->(m: Movie {id: $movieId})
        RETURN r
      `;

    const result = await session.run(query, { userId, movieId });

    if (result.records.length > 0) {
      const foundRelationship = result.records[0].get("r").properties;
      res.status(200).json(foundRelationship);
    } else {
      res.status(204).json({ message: "Relationship not found" });
    }
  } catch (error) {
    console.error("Error fetching relationship:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await session.close();
  }
};
