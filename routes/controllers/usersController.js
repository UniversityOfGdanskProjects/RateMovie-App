import driver from "../../db/neo4jDriver.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { isValidEmail, isValidUsername, isValidPassword } from "../../helpers/validation.js";
import { checkNodeExistence } from "../../helpers/checkExistence.js";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const session = driver.session();

    if (!isValidEmail(email) || !isValidUsername(username) || !isValidPassword(password)) {
        res.status(400).json({ error: 'Invalid input format' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkEmailResult = await session.run(
            'MATCH (user:User {email: $email}) RETURN user',
            { email }
        );

        if (checkEmailResult.records.length > 0) {
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }

        const checkUsernameResult = await session.run(
            'MATCH (user:User {username: $username}) RETURN user',
            { username }
        );

        if (checkUsernameResult.records.length > 0) {
            res.status(400).json({ error: 'Username is already taken' });
            return;
        }

        const result = await session.run(
            'CREATE (user:User {userId: $userId, username: $username, email: $email, password: $password, isAdmin: false}) RETURN user',
            { userId: uuidv4(), username, email, password: hashedPassword }
        );

        const newUser = result.records[0].get('user').properties;
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();

    try {
        const userResult = await session.run(
            'MATCH (user:User {username: $username}) RETURN user',
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

        res.status(200).json({
            message: 'Login successful',
          });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
}

export const usersRanking = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.executeRead(tx => tx.run(`
            MATCH (u:User)-[r:REVIEWED|:COMMENTED]-(m:Movie)
            RETURN u, COUNT(r) as activity
            ORDER BY activity DESC
            LIMIT 20
        `));

        const data = result.records.map(record => {
            const user = record.get('u').properties;
            const activity = record.get('activity').toNumber();
            
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