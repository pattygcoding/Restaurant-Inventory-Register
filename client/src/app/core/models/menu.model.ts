export enum MenuItemCategory {
  ENTREE = 'ENTREE',
  SIDE = 'SIDE',
  DESSERT = 'DESSERT',
  DRINK = 'DRINK',
  TOPPING = 'TOPPING'
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuItemCategory;
  basePrice: number;
  optionsJson: string;
  isTopping: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemOptions {
  sizes?: string[];
  flavors?: string[];
}

export interface Inventory {
  id: string;
  menuItemId: string;
  quantityOnHand: number;
  reorderLevel: number;
  updatedAt: string;
  menuItem?: MenuItem;
}

export interface AdjustInventoryRequest {
  delta: number;
  reason: string;
}