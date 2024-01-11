import driver from "../../db/neo4jDriver.js";
import { config } from 'dotenv';
import { checkNodeExistence,
     checkRelationshipExistence } from "../../helpers/checkExistence.js";
import { addMovieToAction } from "../../helpers/movieHelpers.js";
import { isValidateCommentReview, isValidRating } from "../../helpers/validation.js";

config()
const { TMDB_API_KEY, JWT_SECRET } = process.env

export const getMovies = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (m:Movie)
            OPTIONAL MATCH (m)<-[:DIRECTED]-(director:Person)
            OPTIONAL MATCH (m)<-[:ACTED_IN]-(actor:Person)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            RETURN m, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT actor) AS actors, COLLECT (DISTINCT genre) as genres
            LIMIT 10
        `));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const directors = record.get('directors').map(director => director.properties);
            const actors = record.get('actors').map(actor => actor.properties);
            const genres = record.get('genres').map(genre => genre.properties);

            return { ...movie, directors, actors, genres };
        });

        res.json(data);
    } catch (error) {
        console.error('Error retrieving movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const getPopularMovies = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (u:User)-[r:REVIEWED]->(m:Movie)
            OPTIONAL MATCH (m)<-[:DIRECTED]-(director:Person)
            OPTIONAL MATCH (m)<-[:ACTED_IN]-(actor:Person)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            WITH m, COUNT(r) AS numberOfReviews, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT actor) AS actors, COLLECT (DISTINCT genre) as genres
            RETURN m, numberOfReviews, directors, actors, genres
            ORDER BY numberOfReviews DESC
            LIMIT 10
        `));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const numberOfReviews = record.get('numberOfReviews').toNumber();
            const directors = record.get('directors').map(director => director.properties);
            const actors = record.get('actors').map(actor => actor.properties);
            const genres = record.get('genres').map(genre => genre.properties);

            return { ...movie, numberOfReviews, directors, actors, genres};
        });

        res.json(data);
    } catch (error) {
        console.error('Error retrieving popular movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const getMovieById = async (req, res) => {
    const id = req.params.movieId;
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (n:Movie {id: $id})
            OPTIONAL MATCH (n)<-[:DIRECTED]-(director:Person)
            OPTIONAL MATCH (n)<-[:ACTED_IN]-(actor:Person)
            OPTIONAL MATCH (m)-[:IN_GENRE]->(genre: Genre)
            RETURN n, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT actor) AS actors, COLLECT (DISTINCT genre) as genres
        `, { id: id }));

        if (result.records.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            const movie = result.records[0].get('n').properties;
            const directors = result.records[0].get('directors').map(director => director.properties);
            const genres = record.get('genres').map(genre => genre.properties);

            return { ...movie, numberOfReviews, directors, actors, genres};
            res.json(data);
        }
    } catch (error) {
        console.error('Error retrieving movie by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

const buildQueryWhere = (conditions) => {
    const conditionsArray = Object.entries(conditions)
        .filter(([key, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `(${value})`);

    return conditionsArray.length > 0 ? ` WHERE ${conditionsArray.join(' AND ')}` : '';
};

const buildQuery = ({ title, genre, rating, year, sortBy, sortOrder, name, userId}) => {

    const queryMatch = name ? 
        `MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED| :ACTED_IN]-(p: Person) 
        OPTIONAL MATCH (m)<-[:DIRECTED]-(director:Person)
        OPTIONAL MATCH (m)<-[:ACTED_IN]-(actor:Person)
        OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m) 
        OPTIONAL MATCH (u2: User {userId: "${userId}"})-[ignores:IGNORES]->(m)`
        :
        `MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)
        OPTIONAL MATCH (m)<-[:DIRECTED]-(director:Person)
        OPTIONAL MATCH (m)<-[:ACTED_IN]-(actor:Person)
        OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m) 
        OPTIONAL MATCH (u2: User {userId: "${userId}"})-[ignores:IGNORES]->(m)`;

    const queryWith = name ? 
        ` WITH m, g, ignores, p, 
        AVG(r.rating) AS avgRating, 
        COUNT(r) AS popularity,
        director, 
        actor`
        :
        ` WITH m, g, ignores,
        AVG(r.rating) AS avgRating, 
        COUNT(r) AS popularity,
        director, 
        actor`
        ;
    const conditions = {
        title: title && `m.title =~ '(?i).*${title}.*' OR m.original_title =~ '(?i).*${title}.*'`,
        rating: rating && `avgRating >= $rating AND avgRating <= $rating + 1`,
        genre: genre && `g.name = $genre`,
        year: year && `m.release_date STARTS WITH $year`,
        name: name && `p.name =~ '(?i).*${name}.*'`,
        userId: userId && 'ignores IS NULL'
    };
    const queryWhere = buildQueryWhere(conditions);

    const orderQuery = (sortBy && sortOrder)
        ? (['avgRating', 'popularity'].includes(sortBy)
            ? ` ORDER BY ${sortBy} ${sortOrder}`
            : ` ORDER BY m.${sortBy} ${sortOrder}`
        )
        : '';

    const queryReturn = ' RETURN m, COLLECT(DISTINCT director) AS directors, COLLECT(DISTINCT actor) AS actors, COLLECT(DISTINCT g) AS genres';

    return `${queryMatch}${queryWith}${queryWhere}${queryReturn}${orderQuery}`;
};

export const searchMovies = async (req, res) => {
    const { title, genre, rating, year, sortBy, sortOrder, userId } = req.body;
    const session = driver.session();
    
    if (userId) {
        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);

        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
    }

    try {
        const query = buildQuery({ title, genre, rating, year, sortBy, sortOrder, userId });
        console.log(query);

        const result = await session.executeRead(tx => tx.run(query, {
            title: title,
            genre: genre,
            rating: parseInt(rating),
            year: year
        }));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const directors = record.get('directors').map(director => director.properties);
            const actors = record.get('actors').map(actor => actor.properties);
            const genres = record.get('genres').map(genre => genre.properties)

            return { ...movie, directors, actors, genres };
        });

        res.json(data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const searchMoviesByDirectorOrActor = async (req, res) => {
    const { name, genre, rating, year, sortBy, sortOrder, userId } = req.body;
    const session = driver.session();

    if (userId) {
        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);

        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
    }

    try {
        const query = buildQuery({ name, genre, rating, year, sortBy, sortOrder, userId })
        console.log(query);

        const result = await session.executeRead(tx => tx.run(query, {
            name: name,
            genre: genre,
            rating: parseInt(rating),
            year: year
        }));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const directors = record.get('directors').map(director => director.properties);
            const actors = record.get('actors').map(actor => actor.properties);
            const genres = record.get('genres').map(genre => genre.properties)

            return { ...movie, directors, actors, genres };
        });

        res.json(data);
    } catch (error) {
        console.error('Error searching movies by director/actor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};



export const rateMovie = async (req, res) => {
    const movieId = req.params.movieId ? req.params.movieId : req.body.movieId;
    const { userId, rating, review, date } = req.body;
    const session = driver.session();

    const newDate = date ? date : new Date().toISOString().split('T')[0]

    try {
        if (!isValidRating(rating) || !isValidateCommentReview(review)) {
            res.status(400).json({ error: 'Invalid rating or review. Please provide a comment a comment with a maximum length of 200 characters and rating between 1 and 10.' });
            return;
        }

        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);
        const movieExists = await checkNodeExistence(session, 'Movie', 'id', movieId);
    
        if (!userExists || !movieExists) {
            res.status(404).json({ error: 'User or movie not found' });
            return;
        }

        const isInWatchlistResult = await session.run(`
            MATCH (u:User {userId: $userId})-[:ADDED_TO_WATCHLIST]->(m:Movie {id: $movieId})
            RETURN COUNT(m) > 0 AS isInWatchlist
        `, { userId, movieId });

        const isInWatchlist = isInWatchlistResult.records[0].get('isInWatchlist');

        if (isInWatchlist) {
            await session.run(`
                MATCH (u:User {userId: $userId})-[r:ADDED_TO_WATCHLIST]->(m:Movie {id: $movieId})
                DELETE r
            `, { userId, movieId });
        }

        const result = await session.run(`
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

    const created = result.records[0].get('created');
    const newReview = result.records[0].get('review').properties;

    const successMessage = created ? 'Review added successfully' : 'Review updated successfully';
    const watchlistMessage = isInWatchlist ? 'Movie removed from watchlist.' : '';

    res.status(created ? 201 : 200).json({
        message: `${successMessage} ${watchlistMessage}`,
        review: newReview
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const commentMovie = async (req, res) => {
    const movieId = req.params.movieId ? req.params.movieId : req.body.movieId;
    const { userId, comment } = req.body;

    const session = driver.session();

    try {
        if (!isValidateCommentReview(comment)) {
            res.status(400).json({ error: 'Invalid comment. Please provide a comment with a maximum length of 200 characters.' });
            return;
        }

        const userExists = await checkNodeExistence(session, 'User', 'userId', userId);
        const movieExists = await checkNodeExistence(session, 'Movie', 'id', movieId);

        if (!userExists || !movieExists) {
            res.status(404).json({ error: 'User or Movie not found' });
            return;
        }

        const query = `
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie {id: $movieId})
            CREATE (u)-[r:COMMENTED {comment: $comment, date: $date}]->(m)
            RETURN r
        `;

        const result = await session.executeWrite(tx => tx.run(query, {
            userId,
            movieId,
            comment,
            date: new Date().toISOString().split('T')[0],
        }));

        const createdRelationship = result.records[0].get('r').properties;
        res.status(200).json(createdRelationship);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};


export const addMovieToFavourites = async (req, res) => {
    await addMovieToAction(req, res, 'FAVOURITES');
};

export const addMovieToIgnored = async (req, res) => {
    await addMovieToAction(req, res, 'IGNORES');
};

export const addMovieToWatchlist = async (req, res) => {
    await addMovieToAction(req, res, 'ADDED_TO_WATCHLIST');
};

export const addMovieToFollowed = async (req, res) => {
    await addMovieToAction(req, res, 'FOLLOWED');
};