import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/inventory.component').then(m => m.InventoryComponent)
  }
];