import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from './core/services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule
  ],
  template: `
    <div class="app-container" [class.showcase-mode]="environment.useMockApi">
      @if (environment.useMockApi) {
        <mat-chip-set class="showcase-banner">
          <mat-chip color="accent" selected>
            🎭 Showcase Mode (Mocked API)
          </mat-chip>
        </mat-chip-set>
      }

      @if (authService.isLoggedIn()) {
        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav #sidenav mode="side" opened class="sidenav">
            <mat-toolbar color="primary">
              <span>{{ environment.appName }}</span>
            </mat-toolbar>

            <mat-nav-list>
              <a mat-list-item routerLink="/pos" routerLinkActive="active">
                <mat-icon matListItemIcon>point_of_sale</mat-icon>
                <span matListItemTitle>POS Register</span>
              </a>

              @if (authService.hasRole(['MANAGER', 'ADMIN'])) {
                <a mat-list-item routerLink="/inventory" routerLinkActive="active">
                  <mat-icon matListItemIcon>inventory</mat-icon>
                  <span matListItemTitle>Inventory</span>
                </a>

                <a mat-list-item routerLink="/orders" routerLinkActive="active">
                  <mat-icon matListItemIcon>receipt</mat-icon>
                  <span matListItemTitle>Orders & Reports</span>
                </a>
              }

              @if (authService.hasRole(['ADMIN'])) {
                <a mat-list-item routerLink="/users" routerLinkActive="active">
                  <mat-icon matListItemIcon>people</mat-icon>
                  <span matListItemTitle>User Management</span>
                </a>
              }

              <mat-divider></mat-divider>

              <a mat-list-item (click)="logout()">
                <mat-icon matListItemIcon>logout</mat-icon>
                <span matListItemTitle>Logout</span>
              </a>
            </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content class="main-content">
            <mat-toolbar color="primary" class="top-toolbar">
              <button mat-icon-button (click)="sidenav.toggle()">
                <mat-icon>menu</mat-icon>
              </button>
              <span class="spacer"></span>
              @if (authService.getCurrentUser(); as user) {
                <span>Welcome, {{ user.username }} ({{ user.role }})</span>
              }
            </mat-toolbar>

            <main class="content">
              <router-outlet />
            </main>
          </mat-sidenav-content>
        </mat-sidenav-container>
      } @else {
        <main class="auth-content">
          <router-outlet />
        </main>
      }
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .showcase-banner {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
    }

    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      flex: 1;
      overflow: auto;
    }

    .auth-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #1e3c72, #2a5298);
    }

    mat-nav-list .active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .showcase-mode .showcase-banner {
      display: block;
    }

    .showcase-banner {
      display: none;
    }
  `]
})
export class AppComponent {
  protected authService = inject(AuthService);
  protected environment = environment;

  logout() {
    this.authService.logout();
  }
}
