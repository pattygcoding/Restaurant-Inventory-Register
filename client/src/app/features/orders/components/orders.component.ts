import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="orders-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Orders & Reports</mat-card-title>
          <mat-card-subtitle>View orders and generate reports</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Orders and reports functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 20px;
    }
  `]
})
export class OrdersComponent {}