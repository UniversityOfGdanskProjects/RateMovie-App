import driver from "../../db/neo4jDriver.js";

export const getMovieRanking = async (req, res) => {
  const session = driver.session();
  const query = `MATCH (u:User)-[r:REVIEWED]->(m:Movie)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            WITH m, COUNT(DISTINCT r) AS rating_count, AVG(r.rating) AS rating_avg, 
            COLLECT (DISTINCT genre) as genres
            RETURN m, rating_count, rating_avg, genres
            ORDER BY rating_count DESC, rating_avg DESC`;
  try {
    const result = await session.executeRead((tx) => tx.run(query));

    const data = result.records.map((record) => {
      const movie = record.get("m").properties;
      const rating_count = record.get("rating_count");
      const genres = record.get("genres").map((genre) => genre.properties);
      const rating_avg = record.get("rating_avg");

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
