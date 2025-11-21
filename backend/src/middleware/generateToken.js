import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      process.env.NODE_JWT_TOKEN,
      { expiresIn: "15d" }
    );
    return token;
  } catch (error) {
    console.error("Token generation failed:", error);
    return null;
  }
};
