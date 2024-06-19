import driver from "../../db/neo4jDriver.js";
import { checkNodeExistence } from "../../helpers/checkExistence.js";

export const getMovies = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(`
        MATCH (m:Movie)
        OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
        OPTIONAL MATCH (m)<-[r:REVIEWED]-(u: User)
        RETURN m, COLLECT (DISTINCT genre) as genres, 
        COUNT(DISTINCT r) AS rating_count, AVG(r.rating) AS rating_avg
        LIMIT 10
    `)
    );

    const data = result.records.map((record) => {
      const movie = record.get("m").properties;
      const genres = record.get("genres").map((genre) => genre.properties);
      const rating_count = record.get("rating_count");
      const rating_avg = record.get("rating_avg");

      return { ...movie, genres, rating_avg, rating_count };
    });

    res.json(data);
  } catch (error) {
    console.error("Error retrieving movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getPopularMovies = async (req, res) => {
  const session = driver.session();
  const { userId } = req.query;
  const query = userId
    ? `
            MATCH (u:User)-[r:REVIEWED]->(m:Movie)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            OPTIONAL MATCH (u2: User {userId: "${userId}"})-[ignores:IGNORES]->(m)
            WITH m, COUNT(DISTINCT r) AS rating_count, COLLECT (DISTINCT genre) as genres, AVG(r.rating) AS rating_avg, ignores
            WHERE ignores IS NULL
            RETURN m, rating_count, genres, rating_avg
            ORDER BY rating_count DESC, rating_avg DESC
            LIMIT 20`
    : `MATCH (u:User)-[r:REVIEWED]->(m:Movie)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            WITH m, COUNT(DISTINCT r) AS rating_count, COLLECT (DISTINCT genre) as genres, AVG(r.rating) AS rating_avg
            RETURN m, rating_count, genres, rating_avg
            ORDER BY rating_count DESC, rating_avg DESC
            LIMIT 20`;

  try {
    const result = await session.executeRead((tx) => tx.run(query));

    const data = result.records.map((record) => {
      const movie = record.get("m").properties;
      const rating_count = record.get("rating_count");
      const rating_avg = record.get("rating_avg");
      const genres = record.get("genres").map((genre) => genre.properties);

      return { ...movie, genres, rating_avg, rating_count };
    });

    res.json(data);
  } catch (error) {
    console.error("Error retrieving popular movies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getMovieById = async (req, res) => {
  const id = req.params.movieId;
  const session = driver.session();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `
            MATCH (m:Movie {id: $id})
            OPTIONAL MATCH (m)<-[rd:DIRECTED]-(director:Person)
            OPTIONAL MATCH (m)<-[ra:ACTED_IN]-(actor:Person)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            OPTIONAL MATCH (m)<-[r:REVIEWED]-(u: User)
            RETURN m, COLLECT(DISTINCT director) AS directors, 
                   COLLECT(DISTINCT { actor: actor, character: ra.character }) AS actors,
                   COLLECT (DISTINCT genre) as genres, COUNT(DISTINCT r) AS rating_count, AVG(r.rating) AS rating_avg
        `,
        { id: id }
      )
    );
    if (result.records.length === 0) {
      res.status(404).json({ error: "Movie not found" });
    } else {
      const movie = result.records[0].get("m").properties;
      const directors = result.records[0].get("directors")
        ? result.records[0]
            .get("directors")
            .map((director) => director.properties)
        : [];

      const genres = result.records[0].get("genres")
        ? result.records[0].get("genres").map((genre) => genre.properties)
        : [];
      console.log("tu genres", genres);

      const actors = result.records[0].get("actors")
        ? result.records[0].get("actors").map((actor) => ({
            ...actor.actor?.properties,
            ...(actor.character !== null && { character: actor.character }),
          }))
        : [];
      const rating_count = result.records[0].get("rating_count");
      const rating_avg = result.records[0].get("rating_avg");

      const data = {
        ...movie,
        directors,
        actors,
        genres,
        rating_avg,
        rating_count,
      };
      console.log(genres);
      res.json(data);
    }
  } catch (error) {
    console.error("Error retrieving movie by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

const buildQueryWhere = (conditions) => {
  const conditionsArray = Object.entries(conditions)
    .filter(([key, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `(${value})`);

  return conditionsArray.length > 0
    ? ` WHERE ${conditionsArray.join(" AND ")}`
    : "";
};

const buildQuery = ({
  title,
  genre,
  rating,
  year,
  sortBy,
  sortOrder,
  name,
  userId,
}) => {
  const queryMatch = name
    ? `MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED| :ACTED_IN]-(p: Person) 
        OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m) 
        OPTIONAL MATCH (u2: User {userId: "${userId}"})-[ignores:IGNORES]->(m)`
    : `MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)
        OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m) 
        OPTIONAL MATCH (u2: User {userId: "${userId}"})-[ignores:IGNORES]->(m)`;

  const queryWith = name
    ? ` WITH m, g, ignores, p, 
        AVG(r.rating) AS rating_avg, 
        COUNT(DISTINCT r) AS rating_count`
    : ` WITH m, g, ignores,
        AVG(r.rating) AS rating_avg, 
        COUNT(DISTINCT r) AS rating_count`;
  const conditions = {
    title:
      title &&
      `m.title =~ '(?i).*${title}.*' OR m.original_title =~ '(?i).*${title}.*'`,
    rating: rating && `rating_avg >= $rating AND rating_avg <= $rating + 1`,
    genre: genre && `g.name = $genre`,
    year: year && `m.release_date STARTS WITH $year`,
    name: name && `p.name =~ '(?i).*${name}.*'`,
    userId: userId && "ignores IS NULL",
  };
  const queryWhere = buildQueryWhere(conditions);

  const orderQuery =
    sortBy && sortOrder
      ? ["rating_avg", "rating_count"].includes(sortBy)
        ? ` ORDER BY ${sortBy} ${sortOrder}`
        : ` ORDER BY m.${sortBy} ${sortOrder}`
      : "";

  const queryReturn = ` 
    RETURN m, COLLECT(DISTINCT g) AS genres, rating_avg, rating_count
    `;

  return `${queryMatch}${queryWith}${queryWhere}${queryReturn}${orderQuery}`;
};

export const getGenres = async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.executeRead((tx) =>
      tx.run("MATCH (n:Genre) RETURN n")
    );
    const data = result.records.map((record) => record.get("n").properties);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getActors = async (req, res) => {
  const session = driver.session();
  const n = req.params.n || 0;
  const number = parseInt(n);
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (n:Actor) RETURN n ORDER BY n.name SKIP ${
          number * 300
        } LIMIT 300`
      )
    );

    const data = result.records.map((record) => record.get("n").properties);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getDirectors = async (req, res) => {
  const session = driver.session();
  const n = req.params.n || 0;
  const number = parseInt(n);

  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        `MATCH (d:Director) RETURN d ORDER BY d.name SKIP ${
          number * 300
        } LIMIT 300`
      )
    );

    const data = result.records.map((record) => record.get("d").properties);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error });
  } finally {
    await session.close();
  }
};

export const searchMovies = async (req, res) => {
  const { title, name, genre, rating, year, sortBy, sortOrder, userId } =
    req.query;
  const session = driver.session();

  if (userId) {
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
  }

  try {
    const query = buildQuery({
      title,
      name,
      genre,
      rating,
      year,
      sortBy,
      sortOrder,
      userId,
    });
    // console.log(query);

    const result = await session.executeRead((tx) =>
      tx.run(query, {
        name: name,
        genre: genre,
        rating: parseInt(rating),
        year: year,
      })
    );

    const data = result.records.map((record) => {
      const movie = record.get("m").properties;
      const genres = result.records[0].get("genres")
        ? result.records[0].get("genres").map((genre) => genre.properties)
        : [];
      const rating_avg = record.get("rating_avg");
      const rating_count = record.get("rating_count");

      return { ...movie, genres, rating_count, rating_avg };
    });

    res.json(data);
  } catch (error) {
    console.error("Error searching movies by director/actor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getComments = async (req, res) => {
  const session = driver.session();
  const { movieId } = req.params;
  try {
    const result = await session.executeRead((tx) =>
      tx.run(
        "MATCH (u: User)-[r:COMMENTED]->(m: Movie {id: $movieId}) RETURN r, u",
        { movieId }
      )
    );
    const data = result.records.map((record) => {
      const comment = record.get("r").properties;
      const user = record.get("u").properties;
      return { ...comment, userId: user.userId };
      // return { ...comment, username: user.username, userId: user.userId };
    });
    // console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
