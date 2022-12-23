import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let key = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.header.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, key, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
  return data;
};
