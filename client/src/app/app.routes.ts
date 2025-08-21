import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/pos', 
    pathMatch: 'full' 
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'pos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/pos/pos.routes').then(m => m.posRoutes)
  },
  {
    path: 'inventory',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER', 'ADMIN'] },
    loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.inventoryRoutes)
  },
  {
    path: 'orders',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER', 'ADMIN'] },
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.orderRoutes)
  },
  {
    path: 'users',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes)
  },
  {
    path: '**',
    redirectTo: '/pos'
  }
];
