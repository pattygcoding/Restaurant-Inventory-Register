// For now, creating a mock database client until Prisma can be properly set up
// This will be replaced with actual Prisma client once network issues are resolved

class MockPrismaClient {
  constructor() {
    this._users = [];
    this._menuItems = [];
    this._inventory = [];
    this._orders = [];
    this._orderItems = [];
    this._orderItemToppings = [];
    this._auditLogs = [];
    
    // Initialize with seed data
    this.initializeSeedData();
  }

  initializeSeedData() {
    // Add default users
    this._users = [
      {
        id: '1',
        username: 'admin',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        username: 'cashier',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hashedpassword',
        role: 'CASHIER',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add menu items
    this._menuItems = [
      {
        id: '1',
        name: 'Hamburger',
        category: 'ENTREE',
        basePrice: 8.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Cheeseburger',
        category: 'ENTREE',
        basePrice: 9.99,
        optionsJson: '{}',
        isTopping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // More items will be added in the full seed
    ];
  }

  // Mock Prisma methods
  get user() {
    return {
      findMany: () => Promise.resolve(this._users),
      findUnique: ({ where }) => {
        const user = this._users.find(u => u.id === where.id || u.username === where.username);
        return Promise.resolve(user || null);
      },
      create: ({ data }) => {
        const user = { ...data, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
        this._users.push(user);
        return Promise.resolve(user);
      },
      update: ({ where, data }) => {
        const userIndex = this._users.findIndex(u => u.id === where.id);
        if (userIndex >= 0) {
          this._users[userIndex] = { ...this._users[userIndex], ...data, updatedAt: new Date() };
          return Promise.resolve(this._users[userIndex]);
        }
        return Promise.resolve(null);
      },
      delete: ({ where }) => {
        const userIndex = this._users.findIndex(u => u.id === where.id);
        if (userIndex >= 0) {
          const deleted = this._users.splice(userIndex, 1)[0];
          return Promise.resolve(deleted);
        }
        return Promise.resolve(null);
      }
    };
  }

  get menuItem() {
    return {
      findMany: () => Promise.resolve(this._menuItems),
      findUnique: ({ where }) => {
        const item = this._menuItems.find(i => i.id === where.id);
        return Promise.resolve(item || null);
      }
    };
  }

  get inventory() {
    return {
      findMany: ({ include } = {}) => {
        let result = this._inventory;
        if (include?.menuItem) {
          result = result.map(inv => ({
            ...inv,
            menuItem: this._menuItems.find(mi => mi.id === inv.menuItemId)
          }));
        }
        return Promise.resolve(result);
      },
      findUnique: ({ where, include } = {}) => {
        let item = this._inventory.find(i => i.id === where.id || i.menuItemId === where.menuItemId);
        if (item && include?.menuItem) {
          item = {
            ...item,
            menuItem: this._menuItems.find(mi => mi.id === item.menuItemId)
          };
        }
        return Promise.resolve(item || null);
      },
      update: ({ where, data, include } = {}) => {
        const invIndex = this._inventory.findIndex(i => i.menuItemId === where.menuItemId);
        if (invIndex >= 0) {
          this._inventory[invIndex] = { ...this._inventory[invIndex], ...data };
          let result = this._inventory[invIndex];
          if (include?.menuItem) {
            result = {
              ...result,
              menuItem: this._menuItems.find(mi => mi.id === result.menuItemId)
            };
          }
          return Promise.resolve(result);
        }
        return Promise.resolve(null);
      }
    };
  }

  get order() {
    return {
      findMany: ({ where, include } = {}) => {
        let result = this._orders;
        if (where) {
          if (where.status) result = result.filter(o => o.status === where.status);
          if (where.createdAt) {
            if (where.createdAt.gte) result = result.filter(o => new Date(o.createdAt) >= new Date(where.createdAt.gte));
            if (where.createdAt.lte) result = result.filter(o => new Date(o.createdAt) <= new Date(where.createdAt.lte));
          }
        }
        
        if (include?.orderItems || include?.user) {
          result = result.map(order => {
            const enhanced = { ...order };
            if (include.orderItems) {
              enhanced.orderItems = this._orderItems.filter(oi => oi.orderId === order.id);
              if (include.orderItems.include) {
                enhanced.orderItems = enhanced.orderItems.map(oi => {
                  const enhancedOi = { ...oi };
                  if (include.orderItems.include.menuItem) {
                    enhancedOi.menuItem = this._menuItems.find(mi => mi.id === oi.menuItemId);
                  }
                  if (include.orderItems.include.toppings) {
                    enhancedOi.toppings = this._orderItemToppings.filter(oit => oit.orderItemId === oi.id);
                    if (include.orderItems.include.toppings.include?.toppingItem) {
                      enhancedOi.toppings = enhancedOi.toppings.map(t => ({
                        ...t,
                        toppingItem: this._menuItems.find(mi => mi.id === t.toppingItemId)
                      }));
                    }
                  }
                  return enhancedOi;
                });
              }
            }
            if (include.user) {
              enhanced.user = this._users.find(u => u.id === order.userId);
            }
            return enhanced;
          });
        }
        return Promise.resolve(result);
      },
      findUnique: ({ where, include } = {}) => {
        let order = this._orders.find(o => o.id === where.id);
        if (order && include?.orderItems) {
          order = { ...order };
          order.orderItems = this._orderItems.filter(oi => oi.orderId === order.id);
          if (include.orderItems.include?.menuItem) {
            order.orderItems = order.orderItems.map(oi => ({
              ...oi,
              menuItem: this._menuItems.find(mi => mi.id === oi.menuItemId)
            }));
          }
          if (include.orderItems.include?.toppings) {
            order.orderItems = order.orderItems.map(oi => ({
              ...oi,
              toppings: this._orderItemToppings.filter(oit => oit.orderItemId === oi.id).map(t => ({
                ...t,
                toppingItem: include.orderItems.include.toppings.include?.toppingItem ? 
                  this._menuItems.find(mi => mi.id === t.toppingItemId) : undefined
              }))
            }));
          }
        }
        return Promise.resolve(order || null);
      },
      create: ({ data, include } = {}) => {
        const order = { ...data, id: Date.now().toString(), createdAt: new Date() };
        this._orders.push(order);
        if (include?.orderItems) {
          order.orderItems = [];
        }
        return Promise.resolve(order);
      },
      update: ({ where, data, include } = {}) => {
        const orderIndex = this._orders.findIndex(o => o.id === where.id);
        if (orderIndex >= 0) {
          this._orders[orderIndex] = { ...this._orders[orderIndex], ...data };
          let result = this._orders[orderIndex];
          
          if (include?.orderItems) {
            result = { ...result };
            result.orderItems = this._orderItems.filter(oi => oi.orderId === result.id);
            if (include.orderItems.include?.menuItem) {
              result.orderItems = result.orderItems.map(oi => ({
                ...oi,
                menuItem: this._menuItems.find(mi => mi.id === oi.menuItemId)
              }));
            }
            if (include.orderItems.include?.toppings) {
              result.orderItems = result.orderItems.map(oi => ({
                ...oi,
                toppings: this._orderItemToppings.filter(oit => oit.orderItemId === oi.id).map(t => ({
                  ...t,
                  toppingItem: include.orderItems.include.toppings.include?.toppingItem ? 
                    this._menuItems.find(mi => mi.id === t.toppingItemId) : undefined
                }))
              }));
            }
          }
          return Promise.resolve(result);
        }
        return Promise.resolve(null);
      }
    };
  }

  get orderItem() {
    return {
      create: ({ data }) => {
        const orderItem = { ...data, id: Date.now().toString() };
        this._orderItems.push(orderItem);
        return Promise.resolve(orderItem);
      },
      update: ({ where, data, include } = {}) => {
        const orderItemIndex = this._orderItems.findIndex(oi => oi.id === where.id);
        if (orderItemIndex >= 0) {
          this._orderItems[orderItemIndex] = { ...this._orderItems[orderItemIndex], ...data };
          let result = this._orderItems[orderItemIndex];
          
          if (include?.menuItem) {
            result = {
              ...result,
              menuItem: this._menuItems.find(mi => mi.id === result.menuItemId)
            };
          }
          if (include?.toppings) {
            result = {
              ...result,
              toppings: this._orderItemToppings.filter(oit => oit.orderItemId === result.id)
            };
            if (include.toppings.include?.toppingItem) {
              result.toppings = result.toppings.map(t => ({
                ...t,
                toppingItem: this._menuItems.find(mi => mi.id === t.toppingItemId)
              }));
            }
          }
          return Promise.resolve(result);
        }
        return Promise.resolve(null);
      },
      delete: ({ where }) => {
        const index = this._orderItems.findIndex(oi => oi.id === where.id);
        if (index >= 0) {
          const deleted = this._orderItems.splice(index, 1)[0];
          // Also delete associated toppings
          this._orderItemToppings = this._orderItemToppings.filter(oit => oit.orderItemId !== deleted.id);
          return Promise.resolve(deleted);
        }
        return Promise.resolve(null);
      }
    };
  }

  get orderItemTopping() {
    return {
      create: ({ data }) => {
        const topping = { ...data, id: Date.now().toString() };
        this._orderItemToppings.push(topping);
        return Promise.resolve(topping);
      }
    };
  }

  get auditLog() {
    return {
      create: ({ data }) => {
        const log = { ...data, id: Date.now().toString(), createdAt: new Date() };
        this._auditLogs.push(log);
        return Promise.resolve(log);
      }
    };
  }

  $transaction(operations) {
    // Simple mock transaction - just run all operations
    return Promise.all(operations);
  }
}

// Export mock client for now
export const prisma = new MockPrismaClient();