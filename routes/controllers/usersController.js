// usersController.js
import driver from "../../db/neo4jDriver.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { loginRequired, generateToken } from '../../middleware/auth.js';
// import { isValidEmail, isValidUsername, isValidPassword } from "./usersValidation.js";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const session = driver.session();

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }

    if (!isValidUsername(username)) {
        res.status(400).json({ error: 'Invalid username format' });
        return;
    }

    if (!isValidPassword(password)) {
        res.status(400).json({ error: 'Invalid password format' });
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
            'CREATE (user:User {userId: $userId, username: $username, email: $email, password: $password}) RETURN user',
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
        // -------------------------------------------------------
        // console.log(userResult.records[0].get('user').properties)

        res.status(200).json({
            message: 'Login successful',
            // token: generateToken(userResult.records[0].get('user').properties),
          });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await session.close();
    }
}

export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/;
    return usernameRegex.test(username);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
