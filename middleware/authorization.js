// import { authenticateJWT } from "./auth.js";

// export const authorizeUser = (req, res, next) => {
//   authenticateJWT(req, res, (err) => {
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
//     next();
//   });
// };