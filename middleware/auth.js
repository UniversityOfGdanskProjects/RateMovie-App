// import jwt from 'jsonwebtoken';
// import { config } from 'dotenv';

// config()

// const { JWT_SECRET } = process.env

// export const loginRequired = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//       console.log("brak tokena")
//       return null;
//   }

//   try {
//       const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

//       return decoded.userId;
//   } catch (error) {
//       console.error(error);
//       return null;
//   }
// };

// export const generateToken = (userId) => {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
// };

// export const authorizeUser = (req, res, next) => {
//   authenticateJWT(req, res, (err) => {
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//     next();
//   });
// };