import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const PEPPER = process.env.PEPPER || 'default-pepper-change-me';

export const hashPassword = async (password) => {
  // Add pepper to password before hashing
  const pepperedPassword = password + PEPPER;
  
  return await argon2.hash(pepperedPassword, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
};

export const verifyPassword = async (password, hash) => {
  try {
    const pepperedPassword = password + PEPPER;
    return await argon2.verify(hash, pepperedPassword);
  } catch (error) {
    return false;
  }
};

export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};