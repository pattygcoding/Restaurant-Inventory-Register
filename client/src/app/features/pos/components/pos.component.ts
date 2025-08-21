import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="pos-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>POS Register</mat-card-title>
          <mat-card-subtitle>Point of Sale System</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>POS Register functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .pos-container {
      padding: 20px;
    }
  `]
})
export class PosComponent {}