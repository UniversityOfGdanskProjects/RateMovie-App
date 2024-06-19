import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    // Decode access token
    console.log("jestem tu!!!!!!!!!!");
    const bearerToken = req.headers.authorization;
    // bearerToken would return "Bearer <access_token>"

    const token = bearerToken.split(" ");
    // token would return ["Bearer", "<access_token>"]

    const tokenData = jwt.decode(token[1]);
    // tokenData would return user's data

    // Store decoded token data in request
    console.log("token data", tokenData);
    req.tokenData = tokenData;

    next();
  } catch (error) {
    next(error);
  }
};
