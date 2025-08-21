import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100)
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8).max(100).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  ),
  role: z.enum(['CASHIER', 'MANAGER', 'ADMIN'])
});

export const updateUserSchema = z.object({
  password: z.string().min(8).max(100).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  ).optional(),
  role: z.enum(['CASHIER', 'MANAGER', 'ADMIN']).optional()
});

// Order validation schemas
export const createOrderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  size: z.string().optional(),
  flavor: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
  toppings: z.array(z.string().uuid()).optional()
});

export const checkoutOrderSchema = z.object({
  paymentMethod: z.enum(['MOCK_CARD', 'CASH']),
  cashTendered: z.number().positive().optional()
});

// Inventory validation schemas
export const adjustInventorySchema = z.object({
  delta: z.number().int().min(-1000).max(1000),
  reason: z.string().min(5).max(200)
});

// General validation
export const uuidSchema = z.string().uuid();

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
  };
};