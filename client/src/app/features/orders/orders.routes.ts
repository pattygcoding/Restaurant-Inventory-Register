import { Routes } from '@angular/router';

export const orderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/orders.component').then(m => m.OrdersComponent)
  }
];