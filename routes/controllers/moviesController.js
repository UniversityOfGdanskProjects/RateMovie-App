import driver from "../../db/neo4jDriver.js";
import { config } from 'dotenv';
// import { authorizeUser } from "../../middleware/authorization.js";
// import { loginRequired } from "../../middleware/auth.js";


config()
const { TMDB_API_KEY, JWT_SECRET } = process.env

export const getMovies = async (req, res) => {
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
};

export const getPopularMovies = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (u:User)-[r:REVIEWED]->(m:Movie)
            WITH m, COUNT(r) AS numberOfReviews
            RETURN m, numberOfReviews
            ORDER BY numberOfReviews DESC
            LIMIT 10
        `));

        const data = result.records.map(record => {
            const movie = record.get('m').properties;
            const numberOfReviews = record.get('numberOfReviews').toNumber();
            return { ...movie, numberOfReviews };
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
        const result = await session.executeRead(tx => tx.run('MATCH (n:Movie {id: $id}) RETURN n', { id: id }));
        console.log(result)
        if (result.records.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            const data = result.records.map(record => record.toObject());
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
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `(${value})`);

    return conditionsArray.length > 0 ? ` WHERE ${conditionsArray.join(' AND ')}` : '';
};

const buildQuery = ({ title, genre, rating, year, sortBy, sortOrder, name}) => {
    const queryMatch = name ? 
        'MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie)<-[:DIRECTED| :ACTED_IN]-(p: Person) OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m)'
        :
        'MATCH (g:Genre)<-[:IN_GENRE]-(m:Movie) OPTIONAL MATCH (u:User)-[r:REVIEWED]->(m)';
    const queryWith = name ? 
        ' WITH m, g, AVG(r.rating) AS avgRating, COUNT(r) AS popularity, p'
        :
        ' WITH m, g, AVG(r.rating) AS avgRating, COUNT(r) AS popularity'
        ;
    const conditions = {
        title: title && `(m.title =~ '(?i).*${title}.*' OR m.original_title =~ '(?i).*${title}.*')`,
        rating: rating && `(avgRating >= $rating AND avgRating <= $rating + 1)`,
        genre: genre && `(g.name = $genre)`,
        year: year && `(m.release_date STARTS WITH $year)`,
        name: name && `p.name =~ '(?i).*${name}.*'`
    };
    const queryWhere = buildQueryWhere(conditions);

    const orderQuery = (sortBy && sortOrder)
        ? (['avgRating', 'popularity'].includes(sortBy)
            ? ` ORDER BY ${sortBy} ${sortOrder}`
            : ` ORDER BY m.${sortBy} ${sortOrder}`
        )
        : '';

    const queryReturn = ' RETURN DISTINCT m, avgRating, popularity';

    return `${queryMatch}${queryWith}${queryWhere}${queryReturn}${orderQuery}`;
};

export const searchMovies = async (req, res) => {
    const { title, genre, rating, year, sortBy, sortOrder } = req.body;
    const session = driver.session();

    try {
        const query = buildQuery({ title, genre, rating, year, sortBy, sortOrder });
        console.log(query);

        const result = await session.executeRead(tx => tx.run(query, {
            title: title,
            genre: genre,
            rating: parseInt(rating),
            year: year
        }));

        const data = result.records.map(record => record.toObject());
        res.json(data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const searchMoviesByDirectorOrActor = async (req, res) => {
    const { name, genre, rating, year, sortBy, sortOrder } = req.body;
    const session = driver.session();

    try {
        const query = buildQuery({ name, genre, rating, year, sortBy, sortOrder })
        console.log(query);

        const result = await session.executeRead(tx => tx.run(query, {
            name: name,
            genre: genre,
            rating: parseInt(rating),
            year: year
        }));

        const data = result.records.map(record => record.toObject());
        res.json(data);
    } catch (error) {
        console.error('Error searching movies by director/actor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};


export const rateMovie = async (req, res) => {
    const movieId = req.params.movieId;
    const { userId, rating, review } = req.body;
    const session = driver.session();

    try {
        const result = await session.run(`
            MATCH (u:User {userId: $userId})
            MATCH (m:Movie {id: $movieId})
            OPTIONAL MATCH (u)-[r:REVIEWED]->(m)
            WITH u, m, r
            CALL apoc.do.when( r IS NOT NULL,
                'MATCH (u)-[r:REVIEWED]->(m)
                SET r.rating = newRating, r.review = newReview, r.date = newDate
                RETURN r AS review, false AS created',

                'CREATE (u)-[r:REVIEWED {rating: newRating, review: newReview, date: newDate}]->(m)
                RETURN r AS review, true AS created',
                {newRating: $rating, newReview: $review, newDate: $date}
            )
            YIELD value 
            RETURN value.review AS review, value.created AS created`,
            { userId, movieId, rating, review, date: new Date().toISOString().split('T')[0] }
        );

        const created = result.records[0].get('created');
        const newReview = result.records[0].get('review').properties;

        if (created) {
            res.status(201).json({ message: 'Review added successfully', review: newReview });
        } else {
            res.status(200).json({ message: 'Review updated successfully', review: newReview });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

// export const addMovieFromTmdbById = async (req, res) => {
//     console.log(TMDB_API_KEY)
//     const {id} = req.body;
//     console.log(id)
//     const session = driver.session();
//     try {
//         const result = await session.run(`
//             WITH $id as movieId, "${TMDB_API_KEY}" as tmdbApiKey
//             CALL apoc.load.json('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' 
//                 + tmdbApiKey + '&append_to_response=credits,videos,images') YIELD value
            
//             MERGE (m:Movie {id: value.id})
//             ON CREATE SET 
//                 m.overview = value.overview,
//                 m.original_language = value.original_language,
//                 m.original_title = value.original_title,
//                 m.runtime = value.runtime,
//                 m.title = value.title,
//                 m.poster_path = value.poster_path,
//                 m.backdrop_path = value.backdrop_path,
//                 m.release_date = value.release_date,
//                 m.tagline = value.tagline,
//                 m.budget = value.budget,
//                 m.images = [backdrop IN value.images.backdrops | backdrop.file_path],
//                 m.trailers = [video IN value.videos.results WHERE video.site = 'YouTube' AND video.type = 'Trailer' | video.key]
            
//             FOREACH (director IN value.credits.crew | 
//                 FOREACH (_ IN CASE WHEN director.job = "Director" THEN [1] ELSE [] END |
//                     MERGE (p:Person:Director {id: director.id})
//                     ON CREATE SET p.name = director.name, p.profile_path = director.profile_path
//                     MERGE (m)<-[:DIRECTED]-(p)
//                 )
//             )
            
//             WITH value.credits.cast AS cast, m
//             UNWIND cast AS actorData
//             WITH actorData, m
//             LIMIT 15
//             MERGE (a:Person:Actor {id: actorData.id})
//             ON CREATE SET a.name = actorData.name, a.profile_path = actorData.profile_path
//             MERGE (m)<-[r:ACTED_IN]-(a)
//             ON CREATE SET r.character = actorData.character

//             RETURN m
//         `, { id });

//         const data = result.records.map(record => record.toObject());
//         res.json(data);
//     } catch (error) {
//         console.error('Error retrieving popular movies:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     } finally {
//         await session.close();
//     }
// };