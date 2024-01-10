import bcrypt from 'bcrypt';
import driver from '../../db/neo4jDriver.js';
import { v4 as uuidv4 } from 'uuid';

import { isValidEmail, isValidUsername, isValidPassword } from '../../helpers/validation.js';
import { authenticateAdmin, generateToken } from '../../middleware/auth.js';
import { checkNodeExistence } from '../../helpers/checkExistence.js';
import { removeMovieFromAction, addMovieToAction } from '../../helpers/movieHelpers.js';
import { registerUser } from './usersController.js';
import { commentMovie, rateMovie } from './moviesController.js';
import { config } from 'dotenv';

config();
const { JWT_SECRET } = process.env

export const registerAdmin = async (req, res) => {
    const { username, email, password, adminSecret } = req.body;
    const session = driver.session();

    if (adminSecret !== JWT_SECRET) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!isValidEmail(email) || !isValidUsername(username) || !isValidPassword(password)) {
        res.status(400).json({ error: 'Invalid input format' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const emailExists = await checkNodeExistence(session, 'User', 'email', email);
        if (emailExists) {
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }

        const usernameExists = await checkNodeExistence(session, 'User', 'username', username);
        if (usernameExists) {
            res.status(400).json({ error: 'Username is already taken' });
            return;
        }

        const result = await session.run(
            'CREATE (user:User {userId: $userId, username: $username, email: $email, password: $password, isAdmin: true}) RETURN user',
            { userId: uuidv4(), username, email, password: hashedPassword }
        );

        const newUser = result.records[0].get('user').properties;

        res.status(201).json({ message: 'Admin registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();

    try {
        const userResult = await session.run(
            'MATCH (user:User {username: $username, isAdmin: true}) RETURN user',
            { username }
        );

        if (userResult.records.length === 0) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const storedHashedPassword = userResult.records[0].get('user').properties.password;

        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const userId = userResult.records[0].get('user').properties.userId;
        const token = generateToken(userId, true);

        res.status(200).json({
            message: 'Login successful',
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }

};

export const deleteUser = async (req, res) => {
    const { userId } = req.body;

    authenticateAdmin(req, res, async () => {
        const session = driver.session();
        
        try {
            const userExists = await checkNodeExistence(session, 'User', 'userId', userId);

            if (!userExists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            await session.run('MATCH (user:User {userId: $userId}) DETACH DELETE user', { userId });

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await session.close();
        }
    });
};

export const editUser = async (req, res) => {
    const { userId, username, email, password } = req.body;

    authenticateAdmin(req, res, async () => {
        const session = driver.session();

        try {
            const userExists = await checkNodeExistence(session, 'User', 'userId', userId);

            if (!userExists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const queryParams = { userId };
            const setClauses = [];

            if (username && isValidUsername(username)) {
                setClauses.push('user.username = $newUsername');
                queryParams["newUsername"] = username
            }
            if (email && isValidEmail(email)) {
                setClauses.push('user.email = $newEmail');
                queryParams["newEmail"] = email
            }
            if (password && isValidPassword(password)) {
                setClauses.push('user.password = $newPassword');
                const hashedPassword = await bcrypt.hash(password, 10);
                queryParams["newPassword"] = hashedPassword
            }

            const query = `
                MATCH (user:User {userId: $userId})
                SET ${setClauses.join(', ')}
                RETURN user
            `;

            const result = await session.run(query, queryParams);

            const updatedUser = result.records[0].get('user').properties;

            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await session.close();
        }
    });
};

export const addUser = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        registerUser(req, res);
    });
};

export const addMovieToFavourites = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await addMovieToAction(req, res, 'FAVOURITES');
    });
};

export const addMovieToIgnored = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await addMovieToAction(req, res, 'IGNORES');
    });
};

export const addMovieToWatchlist = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await addMovieToAction(req, res, 'ADDED_TO_WATCHLIST');
    });
};

export const addMovieToFollowed = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await addMovieToAction(req, res, 'FOLLOWED');
    });
};

export const removeMovieFromFavourites = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await removeMovieFromAction(req, res, 'FAVOURITES');
    });
};

export const removeMovieFromIgnored = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await removeMovieFromAction(req, res, 'IGNORES');
    });
};

export const removeMovieFromWatchlist = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await removeMovieFromAction(req, res, 'ADDED_TO_WATCHLIST');
    });
};

export const removeMovieFromFollowed = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
        await removeMovieFromAction(req, res, 'FOLLOWED');
    });
};

export const addComment = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
       await commentMovie(req, res)
    })
};


export const removeComment = async (req, res) => {
    const { commentId } = req.body
    const session = driver.session();

    await authenticateAdmin(req, res, async () => {
        try {
            const query = `
                MATCH ()-[r:COMMENTED]->()
                WHERE ID(r) = $commentId
                DELETE r
            `;

            await session.executeWrite(tx => tx.run(query, { commentId }));
            return { message: 'Comment removed successfully' };
        } finally {
            await session.close();
        }
    })
};

export const editComment = async (req, res) => {
    const session = driver.session();
    const { commentId, newComment } = req.body
    await authenticateAdmin(req, res, async () => {
        try {
            if (!isValidateCommentReview(newComment)) {
                res.status(400).json({ error: 'Invalid comment. Please provide a comment with a maximum length of 200 characters.' });
                return;
            }

            const query = `
                MATCH ()-[c:COMMENTED]->()
                WHERE ID(c) = $commentId
                SET c.comment = $newComment
                RETURN c
            `;

            const result = await session.executeWrite(tx => tx.run(query, {
                commentId,
                newComment,
            }));

            const updatedComment = result.records[0].get('c').properties;
            return updatedComment;
        } finally {
            await session.close();
        }
    })
};

export const addReview = async (req, res) => {
    await authenticateAdmin(req, res, async () => {
       await rateMovie(req, res)
    })
};

export const removeReview = async (req, res) => {
    const { reviewId } = req.body;
    const session = driver.session();

    await authenticateAdmin(req, res, async () => {
        try {
            const query = `
                MATCH ()-[r:REVIEWED]->()
                WHERE ID(r) = $reviewId
                DELETE r
            `;

            await session.executeWrite(tx => tx.run(query, { reviewId }));
            return { message: 'Review removed successfully' };
        } finally {
            await session.close();
        }
    });
};

export const editReview = async (req, res) => {
    const session = driver.session();
    const { reviewId, newRating, newReview } = req.body;

    await authenticateAdmin(req, res, async () => {
        try {
            if (!isValidReview(newReview)) {
                res.status(400).json({ error: 'Invalid review. Please provide a review with a maximum length of 200 characters.' });
                return;
            }

            const query = `
                MATCH ()-[r:REVIEWED]->()
                WHERE ID(r) = $reviewId
                SET r.rating = $newRating, r.review = $newReview
                RETURN r
            `;

            const result = await session.executeWrite(tx => tx.run(query, {
                reviewId,
                newRating,
                newReview,
            }));

            const updatedReview = result.records[0].get('r').properties;
            return updatedReview;
        } finally {
            await session.close();
        }
    });
};

