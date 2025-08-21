import express from 'express';
import { prisma } from '../utils/database.js';
import { roleMiddleware } from '../middleware/auth.js';
import { validateRequest, createOrderItemSchema, checkoutOrderSchema } from '../utils/validation.js';

const router = express.Router();

const TAX_RATE = parseFloat(process.env.TAX_RATE) || 0.07;

// Create new order
router.post('/', async (req, res, next) => {
  try {
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        status: 'OPEN'
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
            toppings: {
              include: {
                toppingItem: true
              }
            }
          }
        }
      }
    });

    // Log order creation
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_ORDER',
        entity: 'Order',
        entityId: order.id,
        metaJson: JSON.stringify({ orderId: order.id })
      }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Add item to order
router.post('/:id/items', validateRequest(createOrderItemSchema), async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { menuItemId, size, flavor, quantity, toppings = [] } = req.body;

    // Check if order exists and is open
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'OPEN') {
      return res.status(400).json({ error: 'Cannot modify closed order' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get menu item
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Calculate line total
    let lineTotal = menuItem.basePrice * quantity;

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        menuItemId,
        size,
        flavor,
        quantity,
        basePrice: menuItem.basePrice,
        lineTotal
      }
    });

    // Add toppings if any
    for (const toppingId of toppings) {
      const topping = await prisma.menuItem.findUnique({
        where: { id: toppingId }
      });

      if (topping && topping.isTopping) {
        const toppingTotal = topping.basePrice * quantity;
        lineTotal += toppingTotal;

        await prisma.orderItemTopping.create({
          data: {
            orderItemId: orderItem.id,
            toppingItemId: toppingId,
            priceDelta: topping.basePrice
          }
        });
      }
    }

    // Update order item with correct total including toppings
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: orderItem.id },
      data: { lineTotal },
      include: {
        menuItem: true,
        toppings: {
          include: {
            toppingItem: true
          }
        }
      }
    });

    // Recalculate order totals
    await recalculateOrderTotals(orderId);

    res.status(201).json(updatedOrderItem);
  } catch (error) {
    next(error);
  }
});

// Remove item from order
router.delete('/:id/items/:orderItemId', async (req, res, next) => {
  try {
    const { id: orderId, orderItemId } = req.params;

    // Check if order exists and is open
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'OPEN') {
      return res.status(400).json({ error: 'Cannot modify closed order' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete order item (cascade will handle toppings)
    await prisma.orderItem.delete({
      where: { id: orderItemId }
    });

    // Recalculate order totals
    await recalculateOrderTotals(orderId);

    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    next(error);
  }
});

// Checkout order
router.post('/:id/checkout', validateRequest(checkoutOrderSchema), async (req, res, next) => {
  try {
    const { id: orderId } = req.params;
    const { paymentMethod, cashTendered } = req.body;

    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
            toppings: {
              include: {
                toppingItem: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'OPEN') {
      return res.status(400).json({ error: 'Order is not open' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.orderItems.length === 0) {
      return res.status(400).json({ error: 'Cannot checkout empty order' });
    }

    // Check inventory availability
    const inventoryChecks = new Map();
    
    for (const item of order.orderItems) {
      // Check main item
      const currentCount = inventoryChecks.get(item.menuItemId) || 0;
      inventoryChecks.set(item.menuItemId, currentCount + item.quantity);

      // Check toppings
      for (const topping of item.toppings) {
        const currentToppingCount = inventoryChecks.get(topping.toppingItemId) || 0;
        inventoryChecks.set(topping.toppingItemId, currentToppingCount + item.quantity);
      }
    }

    // Verify inventory levels
    for (const [menuItemId, requiredQuantity] of inventoryChecks) {
      const inventory = await prisma.inventory.findUnique({
        where: { menuItemId },
        include: { menuItem: true }
      });

      if (!inventory) {
        return res.status(400).json({ 
          error: `Inventory not found for item` 
        });
      }

      if (inventory.quantityOnHand < requiredQuantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${inventory.menuItem.name}. Available: ${inventory.quantityOnHand}, Required: ${requiredQuantity}` 
        });
      }
    }

    // Mock payment processing
    let paymentSuccess = true;
    let change = 0;

    if (paymentMethod === 'MOCK_CARD') {
      // Simulate 90% success rate with 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      paymentSuccess = Math.random() > 0.1;
    } else if (paymentMethod === 'CASH') {
      if (!cashTendered || cashTendered < order.total) {
        return res.status(400).json({ error: 'Insufficient cash tendered' });
      }
      change = cashTendered - order.total;
    }

    if (!paymentSuccess) {
      return res.status(400).json({ 
        error: 'Payment failed. Please try again or use cash.', 
        retryable: true 
      });
    }

    // Process payment success - decrement inventory
    for (const [menuItemId, requiredQuantity] of inventoryChecks) {
      await prisma.inventory.update({
        where: { menuItemId },
        data: {
          quantityOnHand: {
            decrement: requiredQuantity
          },
          updatedAt: new Date()
        }
      });
    }

    // Update order status
    const completedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentMethod
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
            toppings: {
              include: {
                toppingItem: true
              }
            }
          }
        }
      }
    });

    // Log checkout
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CHECKOUT',
        entity: 'Order',
        entityId: orderId,
        metaJson: JSON.stringify({ 
          paymentMethod, 
          total: order.total,
          cashTendered,
          change: change || undefined
        })
      }
    });

    res.json({
      order: completedOrder,
      paymentMethod,
      change: paymentMethod === 'CASH' ? change : undefined,
      message: 'Payment successful'
    });
  } catch (error) {
    next(error);
  }
});

// Void order
router.post('/:id/void', async (req, res, next) => {
  try {
    const { id: orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id && !['MANAGER', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update order status
    const voidedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'VOID' }
    });

    // Log void action
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'VOID_ORDER',
        entity: 'Order',
        entityId: orderId,
        metaJson: JSON.stringify({ voidedBy: req.user.username })
      }
    });

    res.json(voidedOrder);
  } catch (error) {
    next(error);
  }
});

// Get orders (with filtering for MANAGER+)
router.get('/', roleMiddleware(['MANAGER', 'ADMIN']), async (req, res, next) => {
  try {
    const { status, from, to } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: { username: true }
        },
        orderItems: {
          include: {
            menuItem: true,
            toppings: {
              include: {
                toppingItem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Helper function to recalculate order totals
async function recalculateOrderTotals(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          toppings: true
        }
      }
    }
  });

  let subtotal = 0;
  for (const item of order.orderItems) {
    subtotal += item.lineTotal;
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      subtotal,
      tax,
      total
    }
  });
}

export default router;