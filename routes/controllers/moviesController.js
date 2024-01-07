import driver from "../../db/neo4jDriver.js";

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
    const id = parseInt(req.params.id);
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

// export const searchMoviesByDirectorOrActor = async (req, res) => {
//     const searchTerm = req.params.searchTerm;
//     const session = driver.session();
//     console.log(searchTerm)

//     try {
//         const result = await session.executeRead(tx => tx.run(`
//             MATCH (m:Movie)<-[:DIRECTED| :ACTED_IN]-(p: Person)
//             WHERE p.name =~ '(?i).*${searchTerm}.*'
//             RETURN m LIMIT 20
//         `, {}));

//         const data = result.records.map(record => record.toObject());
//         res.json(data);
//     } catch (error) {
//         console.error('Error searching movies by director/actor:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     } finally {
//         await session.close();
//     }
// };
