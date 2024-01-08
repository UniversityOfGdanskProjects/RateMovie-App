import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { config } from 'dotenv';

config()
const { JWT_SECRET } = process.env

export const authenticateJWT = expressJwt.expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
});

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
};