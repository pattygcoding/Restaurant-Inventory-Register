import express from 'express';
import { prisma } from '../utils/database.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res, next) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json(menuItems);
  } catch (error) {
    next(error);
  }
});

// Get specific menu item
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    next(error);
  }
});

export default router;