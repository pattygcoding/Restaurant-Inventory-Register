import express from 'express';
import { prisma } from '../utils/database.js';
import { roleMiddleware } from '../middleware/auth.js';
import { validateRequest, createUserSchema, updateUserSchema } from '../utils/validation.js';
import { hashPassword } from '../utils/auth.js';

const router = express.Router();

// Get all users (ADMIN only)
router.get('/', roleMiddleware(['ADMIN']), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Create user (ADMIN only)
router.post('/', 
  roleMiddleware(['ADMIN']), 
  validateRequest(createUserSchema), 
  async (req, res, next) => {
    try {
      const { username, password, role } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          passwordHash,
          role
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Log user creation
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'CREATE_USER',
          entity: 'User',
          entityId: user.id,
          metaJson: JSON.stringify({ 
            username: user.username, 
            role: user.role,
            createdBy: req.user.username
          })
        }
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// Update user (ADMIN only)
router.patch('/:id', 
  roleMiddleware(['ADMIN']), 
  validateRequest(updateUserSchema), 
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password, role } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prepare update data
      const updateData = {};
      if (role) updateData.role = role;
      if (password) updateData.passwordHash = await hashPassword(password);

      // Update user
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Log user update
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'UPDATE_USER',
          entity: 'User',
          entityId: user.id,
          metaJson: JSON.stringify({ 
            username: user.username,
            updatedFields: Object.keys(updateData),
            updatedBy: req.user.username
          })
        }
      });

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

// Delete user (ADMIN only)
router.delete('/:id', roleMiddleware(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Don't allow deleting self
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    // Log user deletion
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE_USER',
        entity: 'User',
        entityId: id,
        metaJson: JSON.stringify({ 
          deletedUsername: existingUser.username,
          deletedBy: req.user.username
        })
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;