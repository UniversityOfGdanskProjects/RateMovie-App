import express from "express";
import driver from "../db/neo4jDriver.js";
// import { isAuthenticated } from "../middleware/auth";
const moviesRoutes = express.Router();

moviesRoutes.route('/api/movies').get(async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run('MATCH (n:Movie) RETURN n LIMIT 10'));
        const data = result.records.map(record => record.get(0).properties);
        res.json(data);
    } catch (error) {
        console.error('Error retrieving movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
});

moviesRoutes.route('/api/movies/:id').get(async (req, res) => {
    const movieId = req.params.id;
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run('MATCH (n:Movie {movieId: $movieId}) RETURN n', { movieId }));
        if (result.records.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            const data = result.records.map(record => record.get(0).properties);
            res.json(data);
        }
    } catch (error) {
        console.error('Error retrieving movie by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
});

export default moviesRoutes;
