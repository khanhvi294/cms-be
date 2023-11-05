import HttpException from "../errors/httpException";
import { ENV_CONFIG } from "./const";
import jwt from "jsonwebtoken";

const tokenLife = ENV_CONFIG.TOKEN_LIFE_ACCESS_TOKEN || "24h";

export const generateToken = async (data) => {
  if (!data) return null;
  return await jwt.sign(data, secret, { expiresIn: tokenLife });
};

export const verifyToken = async (token) => {
  if (!token)
    return new HttpException(401, "Not authorized to access this resource");

  return await jwt.verify(token, secret);
};

export default {
  generateToken,
  verifyToken,
};
