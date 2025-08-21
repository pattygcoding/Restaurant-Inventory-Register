import express from 'express';
import { prisma } from '../utils/database.js';
import { hashPassword, verifyPassword, generateTokens, verifyRefreshToken } from '../utils/auth.js';
import { validateRequest, loginSchema, registerSchema } from '../utils/validation.js';

const router = express.Router();

// Register new user
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if this is the first user (should be admin)
    const userCount = (await prisma.user.findMany()).length;
    const role = userCount === 0 ? 'ADMIN' : 'CASHIER';

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        passwordHash,
        role
      }
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Log registration
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id,
        metaJson: JSON.stringify({ username: user.username, role: user.role })
      }
    });

    res.json({
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Log login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        metaJson: JSON.stringify({ username: user.username })
      }
    });

    res.json({
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get updated user info
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const tokens = generateTokens(user);

    res.json({
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;