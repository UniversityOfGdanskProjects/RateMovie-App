import driver from "../../db/neo4jDriver.js";
import { config } from 'dotenv';


export const getMovieRanking = async (req, res) => {
    const session = driver.session();
    const query = 
            `MATCH (u:User)-[r:REVIEWED|COMMENTED]->(m:Movie)
            WITH m, COUNT(DISTINCT r) AS popularity, AVG(r.rating) AS rating_avg
            RETURN m, popularity, rating_avg
            ORDER BY popularity DESC`
    try {
        const result = await session.executeRead(tx => tx.run(query));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const popularity = record.get('popularity');
            const rating_avg = record.get('rating_avg')

            return { ...movie, rating_avg, popularity};
        });

        res.json(data);
    } catch (error) {
        console.error('Error retrieving popular movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
}

export const getUsersRanking = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (u:User)-[r:REVIEWED|COMMENTED]-(m:Movie)
            RETURN u, COUNT(r) as activity
            ORDER BY activity DESC
        `));

        const data = result.records.map(record => {
            const user = record.get('u').properties;
            const activity = record.get('activity');
            
            return {
                user,
                activity
            };
        });

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await session.close();
    }
};