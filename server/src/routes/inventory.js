import express from 'express';
import { prisma } from '../utils/database.js';
import { roleMiddleware } from '../middleware/auth.js';
import { validateRequest, adjustInventorySchema } from '../utils/validation.js';

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res, next) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        menuItem: true
      },
      orderBy: {
        menuItem: {
          name: 'asc'
        }
      }
    });

    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

// Adjust inventory (MANAGER+ only)
router.patch('/:menuItemId/adjust', 
  roleMiddleware(['MANAGER', 'ADMIN']),
  validateRequest(adjustInventorySchema),
  async (req, res, next) => {
    try {
      const { menuItemId } = req.params;
      const { delta, reason } = req.body;

      // Get current inventory
      const inventory = await prisma.inventory.findUnique({
        where: { menuItemId },
        include: { menuItem: true }
      });

      if (!inventory) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      const newQuantity = inventory.quantityOnHand + delta;
      if (newQuantity < 0) {
        return res.status(400).json({ error: 'Cannot reduce inventory below zero' });
      }

      // Update inventory
      const updatedInventory = await prisma.inventory.update({
        where: { menuItemId },
        data: {
          quantityOnHand: newQuantity,
          updatedAt: new Date()
        },
        include: {
          menuItem: true
        }
      });

      // Log the adjustment
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'ADJUST_STOCK',
          entity: 'Inventory',
          entityId: inventory.id,
          metaJson: JSON.stringify({
            menuItemName: inventory.menuItem.name,
            delta,
            reason,
            previousQuantity: inventory.quantityOnHand,
            newQuantity
          })
        }
      });

      res.json(updatedInventory);
    } catch (error) {
      next(error);
    }
  }
);

export default router;