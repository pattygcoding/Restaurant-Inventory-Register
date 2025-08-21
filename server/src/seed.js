import { prisma } from './src/utils/database.js';
import { hashPassword } from './src/utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.auditLog.delete({ where: {} }).catch(() => {});
    await prisma.orderItemTopping.delete({ where: {} }).catch(() => {});
    await prisma.orderItem.delete({ where: {} }).catch(() => {});
    await prisma.order.delete({ where: {} }).catch(() => {});
    await prisma.inventory.delete({ where: {} }).catch(() => {});
    await prisma.menuItem.delete({ where: {} }).catch(() => {});
    await prisma.user.delete({ where: {} }).catch(() => {});

    // Create users
    console.log('Creating users...');
    const adminId = uuidv4();
    const cashierId = uuidv4();
    const managerId = uuidv4();

    const users = [
      {
        id: adminId,
        username: 'admin',
        passwordHash: await hashPassword('ChangeMe123!'),
        role: 'ADMIN'
      },
      {
        id: cashierId,
        username: 'cashier',
        passwordHash: await hashPassword('Cashier123!'),
        role: 'CASHIER'
      },
      {
        id: managerId,
        username: 'manager',
        passwordHash: await hashPassword('Manager123!'),
        role: 'MANAGER'
      }
    ];

    for (const user of users) {
      await prisma.user.create({ data: user });
    }

    // Create menu items
    console.log('Creating menu items...');
    
    // Entrées
    const menuItems = [];
    
    // Hamburger
    menuItems.push({
      id: uuidv4(),
      name: 'Hamburger',
      category: 'ENTREE',
      basePrice: 8.99,
      optionsJson: '{}',
      isTopping: false
    });

    // Cheeseburger
    menuItems.push({
      id: uuidv4(),
      name: 'Cheeseburger',
      category: 'ENTREE',
      basePrice: 9.99,
      optionsJson: '{}',
      isTopping: false
    });

    // Hot Dog
    menuItems.push({
      id: uuidv4(),
      name: 'Hot Dog',
      category: 'ENTREE',
      basePrice: 6.99,
      optionsJson: '{}',
      isTopping: false
    });

    // Sides
    menuItems.push({
      id: uuidv4(),
      name: 'Fries (Regular)',
      category: 'SIDE',
      basePrice: 3.99,
      optionsJson: '{}',
      isTopping: false
    });

    menuItems.push({
      id: uuidv4(),
      name: 'Fries (Extra Large)',
      category: 'SIDE',
      basePrice: 5.99,
      optionsJson: '{}',
      isTopping: false
    });

    menuItems.push({
      id: uuidv4(),
      name: 'Poutine',
      category: 'SIDE',
      basePrice: 7.99,
      optionsJson: '{}',
      isTopping: false
    });

    // Desserts
    menuItems.push({
      id: uuidv4(),
      name: 'Ice Cream',
      category: 'DESSERT',
      basePrice: 4.99,
      optionsJson: '{"flavors": ["Chocolate", "Vanilla", "Strawberry"]}',
      isTopping: false
    });

    // Drinks
    menuItems.push({
      id: uuidv4(),
      name: 'Milkshake',
      category: 'DRINK',
      basePrice: 4.99,
      optionsJson: '{"sizes": ["Small", "Medium", "Large"], "flavors": ["Chocolate", "Vanilla", "Strawberry"], "sizePrices": {"Small": 4.99, "Medium": 5.99, "Large": 6.99}}',
      isTopping: false
    });

    menuItems.push({
      id: uuidv4(),
      name: 'Fountain Drink',
      category: 'DRINK',
      basePrice: 2.99,
      optionsJson: '{"sizes": ["Small", "Medium", "Large"], "sizePrices": {"Small": 2.99, "Medium": 3.49, "Large": 3.99}}',
      isTopping: false
    });

    // Toppings
    const toppings = [
      { name: 'Extra Patty', price: 3.00 },
      { name: 'Extra Dog', price: 2.50 },
      { name: 'Mayo', price: 0.25 },
      { name: 'Ketchup', price: 0.25 },
      { name: 'Mustard', price: 0.25 },
      { name: 'Lettuce', price: 0.50 },
      { name: 'Pickles', price: 0.50 },
      { name: 'Tomatoes', price: 0.75 },
      { name: 'Grilled Onions', price: 0.75 },
      { name: 'Onions', price: 0.50 },
      { name: 'Jalapeño Peppers', price: 0.75 },
      { name: 'Bacon', price: 2.00 },
      { name: 'Extra Cheese', price: 1.00 },
      { name: 'Blue Cheese', price: 1.25 },
      { name: 'Habanero Peppers', price: 0.75 },
      { name: 'Bell Peppers', price: 0.75 },
      { name: 'Bar-B-Q Sauce', price: 0.25 },
      { name: 'Hot Sauce', price: 0.25 },
      { name: 'Extra Hot Sauce', price: 0.25 }
    ];

    toppings.forEach(topping => {
      menuItems.push({
        id: uuidv4(),
        name: topping.name,
        category: 'TOPPING',
        basePrice: topping.price,
        optionsJson: '{}',
        isTopping: true
      });
    });

    // Insert all menu items
    for (const item of menuItems) {
      await prisma.menuItem.create({ data: item });
    }

    // Create inventory for all menu items
    console.log('Creating inventory...');
    const allMenuItems = await prisma.menuItem.findMany();
    
    for (const menuItem of allMenuItems) {
      await prisma.inventory.create({
        data: {
          id: uuidv4(),
          menuItemId: menuItem.id,
          quantityOnHand: menuItem.isTopping ? 200 : 100, // More stock for toppings
          reorderLevel: menuItem.isTopping ? 50 : 20
        }
      });
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`Created ${users.length} users and ${menuItems.length} menu items with inventory.`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seed;