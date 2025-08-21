import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="inventory-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Inventory Management</mat-card-title>
          <mat-card-subtitle>Manage stock levels and inventory</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Inventory management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
    }
  `]
})
export class InventoryComponent {}