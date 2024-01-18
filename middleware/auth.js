import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();
const { JWT_SECRET } = process.env;

export const generateToken = (userId, isAdmin = false) => {
    const token = jwt.sign(
        { userId, isAdmin },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

export const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Missing Token' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
        }

        if (!decoded.isAdmin) {
            return res.status(403).json({ error: 'Forbidden - Admin privileges required' });
        }

        req.AdminId = decoded.userId;
        next();
    });
};
