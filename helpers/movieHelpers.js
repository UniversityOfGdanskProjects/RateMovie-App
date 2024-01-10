import driver from "../db/neo4jDriver.js";
import { checkNodeExistence, checkRelationshipExistence } from "./checkExistence.js";

export const addMovieToAction = async (req, res, actionType) => {
    const movieId = req.params.movieId;
    const { userId } = req.body;
    const session = driver.session();

    try {
        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);
        const movieExists = await checkNodeExistence(session, 'Movie', 'id', movieId);

        if (!userExists || !movieExists) {
            res.status(404).json({ error: 'User or Movie not found' });
            return;
        }

        const relationshipExists = await checkRelationshipExistence(session, 'User', 'userId', userId, actionType, 'Movie', 'id', movieId);

        if (relationshipExists) {
            res.status(400).json({ error: 'Relationship already exists' });
            return;
        }

        const query = `
            MATCH (u:User {userId: $userId}) MATCH (m:Movie {id: $movieId})
            CREATE (u)-[r:${actionType}]->(m)
            RETURN r
        `;

        const result = await session.run(query, { userId, movieId });
        const createdRelationship = result.records[0].get('r').properties;
        res.status(200).json({message: `added new relation ${actionType}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const getMoviesByRelation = async (req, res, relationType) => {
    const { userId } = req.body;
    const session = driver.session();

    try {
        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);
        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const query = `
            MATCH (u:User {userId: $userId})-[:${relationType}]->(m:Movie)
            OPTIONAL MATCH (m)<-[:DIRECTED]-(director:Person)
            OPTIONAL MATCH (m)<-[:ACTED_IN]-(actor:Person)
            RETURN m, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT actor) AS actors
        `;

        const result = await session.run(query, { userId });
        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const directors = record.get('directors').map(director => director.properties);
            const actors = record.get('actors').map(actor => actor.properties);
            return { ...movie, directors, actors };
        });

        res.status(200).json({ count: data.length, movies: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};
