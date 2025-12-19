import jwt from "jsonwebtoken";
import BlacklistToken from "../models/BlacklistToken.js";

const checkToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { valid: false, expired: true, decoded: null };
    }
    return { valid: false, expired: false, decoded: null };
  }
};

export const isBlacklisted = async (token) => {
  const blacklisted = await BlacklistToken.findOne({ token });
  return !!blacklisted;
};

export default checkToken;
