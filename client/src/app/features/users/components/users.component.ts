import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="users-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Management</mat-card-title>
          <mat-card-subtitle>Manage system users and roles</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>User management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
    }
  `]
})
export class UsersComponent {}